/**
 * Money Superapp - Vault Cryptography & PIN Authentication Engine
 * Pure client-side zero-dependency Web Crypto AES-GCM (256-bit) encryption,
 * PBKDF2 key derivation (100,000 iterations SHA-256), salted PIN hashing,
 * and application lock security policies.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    var i = 0;
    for (i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    var i = 0;
    for (i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function deriveVaultKey(passphrase, saltUint8, usage) {
    var enc = new TextEncoder();
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj?.subtle) {
      throw new Error('Web Cryptography API is not supported in this environment');
    }
    var keyMaterial = await cryptoObj.subtle.importKey('raw', enc.encode(passphrase), { name: 'PBKDF2' }, false, [
      'deriveKey',
    ]);
    return cryptoObj.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltUint8,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      usage,
    );
  }

  /**
   * @typedef {Object} VaultEnvelope
   * @property {'money-superapp-vault-v1'} format - Vault specification envelope format
   * @property {string} createdAt - ISO 8601 creation timestamp
   * @property {string} salt - Base64 encoded 16-byte PBKDF2 salt
   * @property {string} iv - Base64 encoded 12-byte AES-GCM IV
   * @property {string} ciphertext - Base64 encoded AES-GCM ciphertext
   */

  /**
   * Encrypts plaintext string using AES-GCM (256-bit) and PBKDF2 key derivation (100,000 iterations).
   *
   * @param {string} plainText - Raw JSON or text payload to secure
   * @param {string} passphrase - User encryption passphrase
   * @returns {Promise<string>} Pretty-printed JSON vault envelope string
   */
  async function encryptVaultData(plainText, passphrase) {
    if (!passphrase || typeof passphrase !== 'string' || passphrase.trim() === '') {
      throw new Error('Passphrase cannot be empty');
    }
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj?.subtle) {
      throw new Error('Web Cryptography API is not supported');
    }
    var salt = cryptoObj.getRandomValues(new Uint8Array(16));
    var iv = cryptoObj.getRandomValues(new Uint8Array(12));
    var key = await deriveVaultKey(passphrase, salt, ['encrypt']);
    var enc = new TextEncoder();
    var cipherBuffer = await cryptoObj.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(plainText));

    return JSON.stringify(
      {
        format: 'money-superapp-vault-v1',
        createdAt: new Date().toISOString(),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        ciphertext: arrayBufferToBase64(cipherBuffer),
      },
      null,
      2,
    );
  }

  /**
   * Decrypts encrypted vault envelope back to original plaintext string.
   *
   * @param {string|VaultEnvelope} vaultPayloadOrString - Vault envelope object or serialized JSON string
   * @param {string} passphrase - User passphrase used to encrypt
   * @returns {Promise<string>} Decrypted plaintext content
   */
  async function decryptVaultData(vaultPayloadOrString, passphrase) {
    if (!passphrase || typeof passphrase !== 'string') {
      throw new Error('Passphrase cannot be empty');
    }
    var envelope = vaultPayloadOrString;
    if (typeof vaultPayloadOrString === 'string') {
      envelope = JSON.parse(vaultPayloadOrString);
    }
    if (envelope?.format !== 'money-superapp-vault-v1' || !envelope.salt || !envelope.iv || !envelope.ciphertext) {
      throw new Error('Invalid vault envelope format');
    }

    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj?.subtle) {
      throw new Error('Web Cryptography API is not supported');
    }

    var salt = new Uint8Array(base64ToArrayBuffer(envelope.salt));
    var iv = new Uint8Array(base64ToArrayBuffer(envelope.iv));
    var cipherBuffer = base64ToArrayBuffer(envelope.ciphertext);

    var key = await deriveVaultKey(passphrase, salt, ['decrypt']);
    var decBuffer = await cryptoObj.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipherBuffer);

    var dec = new TextDecoder();
    return dec.decode(decBuffer);
  }

  /**
   * Generates a cryptographically random hexadecimal salt string.
   *
   * @param {number} [byteLength=16] - Desired salt length in bytes
   * @returns {string} Hexadecimal salt string
   */
  function generateSalt(byteLength) {
    var len = Number(byteLength) || 16;
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    var bytes;
    var hex = '';
    var i;
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      bytes = cryptoObj.getRandomValues(new Uint8Array(len));
      for (i = 0; i < bytes.length; i++) {
        hex += `00${bytes[i].toString(16)}`.slice(-2);
      }
      return hex;
    }
    for (i = 0; i < len * 2; i++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    return hex;
  }

  /**
   * Hashes numeric user PIN with salt using SHA-256 (or FNV-1a client fallback).
   *
   * @param {string} pin - Raw user PIN
   * @param {string} [salt=''] - Salt string
   * @returns {Promise<string>} Hexadecimal digest
   */
  async function hashPin(pin, salt) {
    if (!pin || typeof pin !== 'string') {
      throw new Error('PIN must be a non-empty string');
    }
    var saltStr = salt || '';
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    var enc;
    var data;
    var hashBuffer;
    var hashArray;
    var hex;
    var h;
    var str;
    var i;
    if (cryptoObj?.subtle && typeof cryptoObj.subtle.digest === 'function') {
      enc = new TextEncoder();
      data = enc.encode(`${saltStr}:${pin}`);
      hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
      hashArray = Array.from(new Uint8Array(hashBuffer));
      hex = hashArray.map((b) => `00${b.toString(16)}`.slice(-2)).join('');
      return hex;
    }
    h = 0x811c9dc5;
    str = `${saltStr}:${pin}`;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return `00000000${(h >>> 0).toString(16)}`.slice(-8);
  }

  /**
   * Verifies candidate user PIN against stored salted hash.
   *
   * @param {string} pin - Candidate user PIN
   * @param {string} salt - Stored salt
   * @param {string} expectedHash - Stored hash
   * @returns {Promise<boolean>} True if PIN matches
   */
  async function verifyPin(pin, salt, expectedHash) {
    if (!pin || !expectedHash) return false;
    var computed = await hashPin(pin, salt);
    return computed === expectedHash;
  }

  /**
   * Formats auto-lock timeout duration for display in Thai or English.
   *
   * @param {number|string} seconds - Lock timeout duration in seconds (-1 for never, 0 for immediate)
   * @param {'th'|'en'} [lang='th'] - Language code
   * @returns {string} Localized label
   */
  function formatAppLockTimeout(seconds, lang) {
    var sec = Number(seconds);
    var isEn = lang === 'en';
    if (sec === 0) return isEn ? 'Immediately when switching apps' : 'ล็อกทันทีเมื่อสลับหน้าต่าง';
    if (sec === 60) return isEn ? '1 minute' : '1 นาที';
    if (sec === 300) return isEn ? '5 minutes (Recommended)' : '5 นาที (แนะนำ)';
    if (sec === 900) return isEn ? '15 minutes' : '15 นาที';
    if (sec === -1) return isEn ? 'Never (Manual lock only)' : 'ไม่ล็อกอัตโนมัติ (ล็อกด้วยตนเองเท่านั้น)';
    return isEn ? `${sec} seconds` : `${sec} วินาที`;
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.arrayBufferToBase64 = arrayBufferToBase64;
  MoneyApp.base64ToArrayBuffer = base64ToArrayBuffer;
  MoneyApp.deriveVaultKey = deriveVaultKey;
  MoneyApp.encryptVaultData = encryptVaultData;
  MoneyApp.decryptVaultData = decryptVaultData;
  MoneyApp.generateSalt = generateSalt;
  MoneyApp.hashPin = hashPin;
  MoneyApp.verifyPin = verifyPin;
  MoneyApp.formatAppLockTimeout = formatAppLockTimeout;

  if (typeof global !== 'undefined') {
    if (typeof global.encryptVaultData === 'undefined') global.encryptVaultData = encryptVaultData;
    if (typeof global.decryptVaultData === 'undefined') global.decryptVaultData = decryptVaultData;
    if (typeof global.generateSalt === 'undefined') global.generateSalt = generateSalt;
    if (typeof global.hashPin === 'undefined') global.hashPin = hashPin;
    if (typeof global.verifyPin === 'undefined') global.verifyPin = verifyPin;
    if (typeof global.formatAppLockTimeout === 'undefined') global.formatAppLockTimeout = formatAppLockTimeout;
  }
})(typeof window !== 'undefined' ? window : globalThis);
