/**
 * Money Superapp - Encrypted Offline QR Code & P2P Sync Engine
 * Pure client-side zero-dependency QR code matrix generator (Kazuhiko Arase Model)
 * and chunked payload transmission for air-gapped device-to-device transfers.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var QRMode = { MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8 };
  var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7,
  };

  var QRMath = {
    glog: (n) => {
      if (n < 1) throw new Error(`glog(${n})`);
      return QRMath.LOG_TABLE[n];
    },
    gexp: (n) => {
      var val = n;
      while (val < 0) val += 255;
      while (val >= 256) val -= 255;
      return QRMath.EXP_TABLE[val];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256),
  };

  var qrMathInitIdx = 0;
  for (qrMathInitIdx = 0; qrMathInitIdx < 8; qrMathInitIdx++) {
    QRMath.EXP_TABLE[qrMathInitIdx] = 1 << qrMathInitIdx;
  }
  for (qrMathInitIdx = 8; qrMathInitIdx < 256; qrMathInitIdx++) {
    QRMath.EXP_TABLE[qrMathInitIdx] =
      QRMath.EXP_TABLE[qrMathInitIdx - 4] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 5] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 6] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 8];
  }
  for (qrMathInitIdx = 0; qrMathInitIdx < 255; qrMathInitIdx++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[qrMathInitIdx]] = qrMathInitIdx;
  }

  function QRPolynomial(num, shift) {
    var offset = 0;
    var i = 0;
    if (num.length === undefined) throw new Error(`${num.length}/${shift}`);
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
  }

  QRPolynomial.prototype = {
    get: function (index) {
      return this.num[index];
    },
    getLength: function () {
      return this.num.length;
    },
    multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      var i = 0;
      var j = 0;
      for (i = 0; i < this.getLength(); i++) {
        for (j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function (e) {
      var ratio = 0;
      var num = null;
      var i = 0;
      if (this.getLength() - e.getLength() < 0) return this;
      ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      num = new Array(this.getLength());
      for (i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    },
  };

  function QRRSBlock(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }

  QRRSBlock.RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
  ];

  QRRSBlock.getRSBlocks = (typeNumber, errorCorrectLevel) => {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    var length = 0;
    var list = [];
    var i = 0;
    var j = 0;
    var count = 0;
    var totalCount = 0;
    var dataCount = 0;
    if (rsBlock === undefined) {
      throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
    }
    length = rsBlock.length / 3;
    for (i = 0; i < length; i++) {
      count = rsBlock[i * 3 + 0];
      totalCount = rsBlock[i * 3 + 1];
      dataCount = rsBlock[i * 3 + 2];
      for (j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
    }
    return list;
  };

  QRRSBlock.getRsBlockTable = (typeNumber, errorCorrectLevel) => {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }

  QRBitBuffer.prototype = {
    get: function (index) {
      var bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
    },
    put: function (num, length) {
      var i = 0;
      for (i = 0; i < length; i++) {
        this.putBit(((num >>> (length - i - 1)) & 1) === 1);
      }
    },
    putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) this.buffer.push(0);
      if (bit) this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
      this.length++;
    },
  };

  function QR8bitByte(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
  }

  QR8bitByte.prototype = {
    getLength: function () {
      return this.data.length;
    },
    write: function (buffer) {
      var i = 0;
      for (i = 0; i < this.data.length; i++) buffer.put(this.data.charCodeAt(i), 8);
    },
  };

  var QRUtil = {
    PATTERN_POSITION_TABLE: [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
    ],
    G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
    getBCHTypeInfo: (data) => {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15));
      }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHDigit: (data) => {
      var digit = 0;
      var d = data;
      while (d !== 0) {
        digit++;
        d >>>= 1;
      }
      return digit;
    },
    getPatternPosition: (typeNumber) => QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [],
    getMask: (maskPattern, i, j) => {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001:
          return i % 2 === 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 === 0;
        case QRMaskPattern.PATTERN011:
          return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case QRMaskPattern.PATTERN101:
          return ((i * j) % 2) + ((i * j) % 3) === 0;
        case QRMaskPattern.PATTERN110:
          return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
        case QRMaskPattern.PATTERN111:
          return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
        default:
          throw new Error(`bad maskPattern:${maskPattern}`);
      }
    },
    getErrorCorrectPolynomial: (errorCorrectLength) => {
      var a = new QRPolynomial([1], 0);
      var i = 0;
      for (i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: (mode, type) => {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw new Error(`mode:${mode}`);
        }
      } else {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw new Error(`mode:${mode}`);
        }
      }
    },
  };

  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  QRCodeModel.prototype = {
    addData: function (data) {
      var byteData = new QR8bitByte(data);
      this.dataList.push(byteData);
      this.dataCache = null;
    },
    isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(`${row},${col}`);
      }
      return this.modules[row][col];
    },
    getModuleCount: function () {
      return this.moduleCount;
    },
    make: function () {
      this.makeImpl(false, 0);
    },
    makeImpl: function (test, maskPattern) {
      var row = 0;
      var col = 0;
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.dataCache == null) {
        this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern: function (row, col) {
      var r = 0;
      var c = 0;
      for (r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (
            (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)
          ) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    setupTimingPattern: function () {
      var r = 0;
      var c = 0;
      for (r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] !== null) continue;
        this.modules[r][6] = r % 2 === 0;
      }
      for (c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] !== null) continue;
        this.modules[6][c] = c % 2 === 0;
      }
    },
    setupPositionAdjustPattern: function () {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      var i = 0;
      var j = 0;
      var row = 0;
      var col = 0;
      var r = 0;
      var c = 0;
      for (i = 0; i < pos.length; i++) {
        for (j = 0; j < pos.length; j++) {
          row = pos[i];
          col = pos[j];
          if (this.modules[row][col] !== null) continue;
          for (r = -2; r <= 2; r++) {
            for (c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeInfo: function (test, maskPattern) {
      var data = (this.errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      var i = 0;
      var mod = false;
      for (i = 0; i < 15; i++) {
        mod = !test && ((bits >> i) & 1) === 1;
        if (i < 6) this.modules[i][8] = mod;
        else if (i < 8) this.modules[i + 1][8] = mod;
        else this.modules[this.moduleCount - 15 + i][8] = mod;
        if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
        else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
        else this.modules[8][15 - i - 1] = mod;
      }
      this.modules[this.moduleCount - 8][8] = !test;
    },
    mapData: function (data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var col = 0;
      var c = 0;
      var dark = false;
      var mask = false;
      for (col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (c = 0; c < 2; c++) {
            if (this.modules[row][col - c] === null) {
              dark = false;
              if (byteIndex < data.length) {
                dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
              }
              mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) dark = !dark;
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    },
  };

  QRCodeModel.createData = (typeNumber, errorCorrectLevel, dataList) => {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    var buffer = new QRBitBuffer();
    var i = 0;
    var totalDataCount = 0;
    var data = null;
    for (i = 0; i < dataList.length; i++) {
      data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    for (i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
    if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
    while (buffer.length % 8 !== 0) buffer.putBit(false);
    while (true) {
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0xec, 8);
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  };

  QRCodeModel.createBytes = (buffer, rsBlocks) => {
    var offset = 0;
    var maxDcCount = 0;
    var maxEcCount = 0;
    var dcdata = new Array(rsBlocks.length);
    var ecdata = new Array(rsBlocks.length);
    var r = 0;
    var i = 0;
    var dcCount = 0;
    var ecCount = 0;
    var rsPoly = null;
    var rawPoly = null;
    var modPoly = null;
    var modIndex = 0;
    var totalCodeCount = 0;
    var data = null;
    var index = 0;

    for (r = 0; r < rsBlocks.length; r++) {
      dcCount = rsBlocks[r].dataCount;
      ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      offset += dcCount;
      rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (i = 0; i < ecdata[r].length; i++) {
        modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }
    for (i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
    data = new Array(totalCodeCount);
    for (i = 0; i < maxDcCount; i++) {
      for (r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) data[index++] = dcdata[r][i];
      }
    }
    for (i = 0; i < maxEcCount; i++) {
      for (r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) data[index++] = ecdata[r][i];
      }
    }
    return data;
  };

  /**
   * @typedef {Object} QrSvgOptions
   * @property {number} [size=256] - Width and height of SVG image in pixels
   * @property {number} [margin=2] - Margin border in quiet zone modules
   * @property {string} [color='#000000'] - Foreground module fill color
   * @property {string} [background='#ffffff'] - Background canvas fill color
   */

  /**
   * Renders a QR code matrix directly to an inline SVG XML markup string.
   *
   * @param {string} text - Text, JSON, or payload chunk to encode
   * @param {QrSvgOptions} [options] - Visual rendering options
   * @returns {string} Inline SVG markup string
   */
  function renderQrSvg(text, options) {
    var opt = options || {};
    var size = opt.size || 256;
    var margin = typeof opt.margin === 'number' ? opt.margin : 2;
    var fg = opt.color || '#000000';
    var bg = opt.background || '#ffffff';
    var capacities = [0, 17, 32, 53, 78, 106, 134, 154, 192, 230, 271];
    var typeNumber = 1;
    var v = 1;
    var str = String(text || '');
    var qr = null;
    var count = 0;
    var viewBoxSize = 0;
    var rects = [];
    var r = 0;
    var c = 0;

    for (v = 1; v <= 10; v++) {
      if (str.length <= capacities[v]) {
        typeNumber = v;
        break;
      }
    }
    if (str.length > capacities[10]) typeNumber = 10;

    qr = new QRCodeModel(typeNumber, QRErrorCorrectLevel.L);
    qr.addData(str);
    qr.make();

    count = qr.getModuleCount();
    viewBoxSize = count + margin * 2;

    for (r = 0; r < count; r++) {
      for (c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          rects.push(`<rect x="${c + margin}" y="${r + margin}" width="1" height="1"/>`);
        }
      }
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      viewBoxSize +
      ' ' +
      viewBoxSize +
      '" width="' +
      size +
      '" height="' +
      size +
      '" shape-rendering="crispEdges">' +
      '<rect width="100%" height="100%" fill="' +
      bg +
      '"/>' +
      '<g fill="' +
      fg +
      '">' +
      rects.join('') +
      '</g>' +
      '</svg>'
    );
  }

  /**
   * @typedef {Object} P2PPayloadChunk
   * @property {number} c - 1-based index of this chunk
   * @property {number} t - Total chunk count
   * @property {string} d - Chunk substring data payload
   * @property {string} id - Unique transfer session identifier
   */

  /**
   * Splits arbitrary payload string into sequential QR chunks for air-gapped camera transmission.
   *
   * @param {string} payload - Raw text, JSON, or encrypted vault envelope string
   * @param {number} [maxChunkSize=200] - Maximum payload character length per QR frame
   * @param {string} [transferId] - Unique transfer session identifier
   * @returns {Array<P2PPayloadChunk>} Array of chunk objects ready for sequential QR display
   */
  function chunkPayload(payload, maxChunkSize, transferId) {
    var size = Math.max(50, maxChunkSize || 200);
    var str = String(payload || '');
    var id = transferId || `v_${Math.random().toString(36).substring(2, 8)}`;
    var totalChunks = Math.ceil(str.length / size) || 1;
    var chunks = [];
    var i = 0;
    var chunkStr = '';

    for (i = 0; i < totalChunks; i++) {
      chunkStr = str.substring(i * size, (i + 1) * size);
      chunks.push({
        c: i + 1,
        t: totalChunks,
        d: chunkStr,
        id: id,
      });
    }
    return chunks;
  }

  /**
   * @typedef {Object} P2PAssemblyResult
   * @property {boolean} complete - True if all required chunks were successfully received
   * @property {number} received - Count of unique chunks received
   * @property {number} total - Total expected chunk count
   * @property {Array<number>} missing - Array of missing 1-based chunk indices
   * @property {string|null} payload - Reassembled full payload string or null
   */

  /**
   * Reconstructs full payload from scanned QR chunks, tracking missing frames.
   *
   * @param {Array<P2PPayloadChunk>} chunkArray - Array of scanned chunk objects
   * @returns {P2PAssemblyResult} Assembly status and reconstructed payload string
   */
  function assembleChunks(chunkArray) {
    var id = '';
    var total = 0;
    var receivedMap = {};
    var receivedCount = 0;
    var i = 0;
    var ch = null;
    var m = 0;
    var missing = [];
    var fullData = '';
    var k = 0;

    if (!Array.isArray(chunkArray) || chunkArray.length === 0) {
      return { complete: false, received: 0, total: 0, missing: [], payload: null };
    }

    id = chunkArray[0].id;
    total = chunkArray[0].t;

    for (i = 0; i < chunkArray.length; i++) {
      ch = chunkArray[i];
      if (ch && ch.id === id && typeof ch.c === 'number' && !receivedMap[ch.c]) {
        receivedMap[ch.c] = ch.d;
        receivedCount++;
      }
    }

    if (receivedCount < total) {
      for (m = 1; m <= total; m++) {
        if (!receivedMap[m]) missing.push(m);
      }
      return {
        complete: false,
        received: receivedCount,
        total: total,
        missing: missing,
        payload: null,
      };
    }

    for (k = 1; k <= total; k++) {
      fullData += receivedMap[k] || '';
    }

    return {
      complete: true,
      received: total,
      total: total,
      missing: [],
      payload: fullData,
    };
  }

  /**
   * Checks whether the standard BarcodeDetector API is natively supported in the current environment.
   *
   * @returns {boolean} True if BarcodeDetector is available
   */
  function isBarcodeDetectorSupported() {
    const detector = global?.BarcodeDetector || (typeof window !== 'undefined' && window.BarcodeDetector);
    return typeof detector !== 'undefined';
  }

  /**
   * Creates a configured BarcodeDetector instance for QR code scanning.
   *
   * @param {Array<string>} [formats=['qr_code']] - Barcode formats to detect
   * @returns {Object|null} BarcodeDetector instance or null if unsupported
   */
  function createBarcodeDetector(formats = ['qr_code']) {
    const Detector = global?.BarcodeDetector || (typeof window !== 'undefined' && window.BarcodeDetector);
    if (!Detector) return null;
    try {
      return new Detector({ formats });
    } catch (_e) {
      return null;
    }
  }

  /**
   * Safely scans a video, canvas, image, or ImageBitmap source using BarcodeDetector.
   *
   * @param {Object} detector - BarcodeDetector instance
   * @param {CanvasImageSource|ImageBitmap|HTMLVideoElement|HTMLImageElement} source - Visual source to inspect
   * @returns {Promise<Array<{ rawValue: string, format: string, boundingBox: Object|null }>>} Detected barcodes
   */
  async function scanQrFromSource(detector, source) {
    if (!detector || typeof detector.detect !== 'function' || source == null) return [];
    try {
      const barcodes = await detector.detect(source);
      return (barcodes || []).map((b) => ({
        rawValue: b.rawValue || '',
        format: b.format || 'qr_code',
        boundingBox: b.boundingBox || null,
      }));
    } catch (_e) {
      return [];
    }
  }

  /**
   * Plays a native zero-dependency audio chime on slice capture via Web Audio API.
   *
   * @param {{ frequency?: number, duration?: number }} [options] - Audio synthesis options
   * @returns {boolean} True if audio feedback was triggered successfully
   */
  function playScanFeedbackChime({ frequency = 880, duration = 0.08 } = {}) {
    const win =
      (typeof global !== 'undefined' && global) ||
      (typeof window !== 'undefined' && window) ||
      (typeof globalThis !== 'undefined' && globalThis) ||
      null;
    if (!win) return false;
    try {
      const AudioCtx = win.AudioContext || win.webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
      setTimeout(
        () => {
          try {
            ctx.close();
          } catch (_e) {}
        },
        Math.round(duration * 1000) + 100,
      );
      return true;
    } catch (_e) {
      return false;
    }
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.QRMode = QRMode;
  MoneyApp.QRErrorCorrectLevel = QRErrorCorrectLevel;
  MoneyApp.QRMaskPattern = QRMaskPattern;
  MoneyApp.QRMath = QRMath;
  MoneyApp.QRPolynomial = QRPolynomial;
  MoneyApp.QRRSBlock = QRRSBlock;
  MoneyApp.QRBitBuffer = QRBitBuffer;
  MoneyApp.QR8bitByte = QR8bitByte;
  MoneyApp.QRUtil = QRUtil;
  MoneyApp.QRCodeModel = QRCodeModel;
  MoneyApp.renderQrSvg = renderQrSvg;
  MoneyApp.generateQrSvg = renderQrSvg;
  MoneyApp.chunkPayload = chunkPayload;
  MoneyApp.assembleChunks = assembleChunks;
  MoneyApp.isBarcodeDetectorSupported = isBarcodeDetectorSupported;
  MoneyApp.createBarcodeDetector = createBarcodeDetector;
  MoneyApp.scanQrFromSource = scanQrFromSource;
  MoneyApp.playScanFeedbackChime = playScanFeedbackChime;

  if (typeof global !== 'undefined') {
    if (typeof global.generateQrSvg === 'undefined') global.generateQrSvg = renderQrSvg;
    if (typeof global.chunkPayload === 'undefined') global.chunkPayload = chunkPayload;
    if (typeof global.assembleChunks === 'undefined') global.assembleChunks = assembleChunks;
    if (typeof global.isBarcodeDetectorSupported === 'undefined')
      global.isBarcodeDetectorSupported = isBarcodeDetectorSupported;
    if (typeof global.createBarcodeDetector === 'undefined') global.createBarcodeDetector = createBarcodeDetector;
    if (typeof global.scanQrFromSource === 'undefined') global.scanQrFromSource = scanQrFromSource;
    if (typeof global.playScanFeedbackChime === 'undefined') global.playScanFeedbackChime = playScanFeedbackChime;
  }
})(typeof window !== 'undefined' ? window : globalThis);
