/**
 * @typedef {Object} BudgetImportIncome
 * @property {string} name - Name of income stream
 * @property {number} value - Monthly amount in THB
 * @property {boolean} [isSalary] - Whether this stream represents the primary salary
 */

/**
 * @typedef {Object} BudgetImportExpense
 * @property {string} name - Name of expense item
 * @property {number} value - Monthly amount in THB
 * @property {boolean} [auto] - Whether auto-calculated
 * @property {'tax'|'sso'|'pvd'} [autoType] - Automated statutory category
 */

/**
 * @typedef {Object} BudgetImportSaving
 * @property {string} name - Name of savings / investment item
 * @property {number} value - Monthly amount in THB
 */

/**
 * @typedef {Object} BudgetImportCandidate
 * @property {BudgetImportIncome[]} incomes - Normalized income items
 * @property {BudgetImportExpense[]} expenses - Normalized expense items
 * @property {BudgetImportSaving[]} savings - Normalized savings items
 * @property {{ tax: boolean, sso: boolean, pvd: boolean }} [manualOverrides] - Manual statutory override flags
 * @property {boolean} [showEmergencyRunway] - Whether emergency runway panel is enabled
 * @property {number} [currentEmergencyReserve] - Current cash reserve in THB
 * @property {number} [pvdPercent] - Detected PVD contribution percentage
 */

/**
 * @typedef {Object} BudgetDetectedColumns
 * @property {number} catCol - 0-indexed column for Category
 * @property {number} itemCol - 0-indexed column for Item Name
 * @property {number} amtCol - 0-indexed column for Amount
 * @property {number} noteCol - 0-indexed column for Note / Remarks
 */

((global) => {
  const DEFAULT_STORAGE_KEY = 'remainingMoneyState';
  const DEFAULT_PVD_KEY = 'remainingMoney_pvdPercent';
  const AUTO_TAX_NAME_TH = 'ภาษีหัก ณ ที่จ่าย';
  const AUTO_SSO_NAME_TH = 'ประกันสังคม';
  const AUTO_PVD_NAME_TH = 'กองทุนสำรองเลี้ยงชีพ (PVD)';

  /**
   * Identifies automated statutory type from item object or name string.
   * @param {{ autoType?: string, name?: string }} [item]
   * @returns {'tax'|'sso'|'pvd'|null}
   */
  function getAutoType(item) {
    if (!item) return null;
    if (item.autoType === 'tax' || item.autoType === 'sso' || item.autoType === 'pvd') {
      return item.autoType;
    }
    const name = String(item.name || '').toLowerCase();
    if (name.includes('tax') || name.includes('ภาษี')) return 'tax';
    if (name.includes('sso') || name.includes('ประกันสังคม')) return 'sso';
    if (name.includes('pvd') || name.includes('สำรองเลี้ยงชีพ')) return 'pvd';
    return null;
  }

  /**
   * RFC 4180 compliant CSV parser with quote escaping, multi-line values, and BOM stripping.
   * @param {string} csvText
   * @returns {string[][]} Array of string rows
   */
  function parseCSVRows(csvText) {
    if (typeof csvText !== 'string') return [];
    if (csvText.charCodeAt(0) === 0xfeff) {
      csvText = csvText.slice(1);
    }
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let inQuotes = false;
    let i = 0;
    const len = csvText.length;

    while (i < len) {
      const char = csvText[i];
      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < len && csvText[i + 1] === '"') {
            currentVal += '"';
            i += 2;
          } else {
            inQuotes = false;
            i++;
          }
        } else {
          currentVal += char;
          i++;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
          i++;
        } else if (char === ',') {
          currentRow.push(currentVal.trim());
          currentVal = '';
          i++;
        } else if (char === '\r') {
          if (i + 1 < len && csvText[i + 1] === '\n') {
            i++;
          }
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
        } else if (char === '\n') {
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
        } else {
          currentVal += char;
          i++;
        }
      }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
    }
    return rows;
  }

  /**
   * Detects Category, Item Name, Amount, and Note column indexes from CSV header row.
   * @param {string[]} headerRow
   * @returns {BudgetDetectedColumns}
   */
  function detectColumns(headerRow) {
    let catCol = -1;
    let itemCol = -1;
    let amtCol = -1;
    let noteCol = -1;

    headerRow.forEach((col, idx) => {
      const c = col.toLowerCase().trim();
      if (c.includes('category') || c.includes('หมวด') || c.includes('ประเภท')) {
        if (catCol === -1) catCol = idx;
      } else if (c.includes('item') || c.includes('รายการ') || c.includes('ชื่อ') || c.includes('name')) {
        if (itemCol === -1) itemCol = idx;
      } else if (
        c.includes('amount') ||
        c.includes('จำนวน') ||
        c.includes('value') ||
        c.includes('thb') ||
        c.includes('บาท')
      ) {
        if (amtCol === -1) amtCol = idx;
      } else if (c.includes('note') || c.includes('หมายเหตุ') || c.includes('remark') || c.includes('comment')) {
        if (noteCol === -1) noteCol = idx;
      }
    });

    if (catCol === -1) catCol = 0;
    if (itemCol === -1) itemCol = 1;
    if (amtCol === -1) amtCol = 2;
    if (noteCol === -1) noteCol = 3;

    return { catCol, itemCol, amtCol, noteCol };
  }

  /**
   * Cleans CSV field string by trimming and stripping leading apostrophe.
   * @param {string} val
   * @returns {string}
   */
  function cleanField(val) {
    if (typeof val !== 'string') return '';
    let s = val.trim();
    if (s.startsWith("'")) {
      s = s.slice(1).trim();
    }
    return s;
  }

  /**
   * Sanitizes numeric string or number to clean positive THB amount.
   * @param {string|number} val
   * @returns {number}
   */
  function cleanAmount(val) {
    if (typeof val === 'number') return Number.isNaN(val) ? 0 : Math.max(0, val);
    if (typeof val !== 'string') return 0;
    let s = val.trim();
    if (s.startsWith("'")) s = s.slice(1).trim();
    s = s.replace(/,/g, '').replace(/[^\d.-]/g, '');
    const num = Number.parseFloat(s);
    return Number.isNaN(num) ? 0 : Math.max(0, num);
  }

  /**
   * Determines if a row represents a summary/subtotal line rather than an item.
   * @param {string} [cat]
   * @param {string} [item]
   * @returns {boolean}
   */
  function isSubtotalRow(cat, item) {
    const c = String(cat || '').toLowerCase();
    const it = String(item || '').toLowerCase();
    if (c === 'summary' || c === 'สรุป') return true;
    if (it === 'total' || it === 'รวม') return true;
    if (it.startsWith('total income') || it.startsWith('รวมรายได้')) return true;
    if (it.startsWith('total expense') || it.startsWith('รวมค่าใช้จ่าย')) return true;
    if (it.startsWith('total saving') || it.startsWith('รวมเงินออม')) return true;
    if (it.includes('subtotal') || it.includes('รวมทั้งสิ้น')) return true;
    if (
      it.includes('remaining money') ||
      it.includes('remaining for investment') ||
      it.includes('เงินคงเหลือสำหรับลงทุน') ||
      it.includes('เงินคงเหลือ')
    ) {
      return true;
    }
    return false;
  }

  /**
   * Parses JSON text into a normalized candidate budget object.
   * @param {string|Object} text - Raw JSON string or parsed object
   * @param {{ isEN?: boolean, defaultPvd?: number }} [options]
   * @returns {BudgetImportCandidate|null} Candidate budget object or null
   */
  function parseImportJSON(text, options = {}) {
    let parsed;
    try {
      parsed = typeof text === 'string' ? JSON.parse(text) : text;
    } catch (_e) {
      return null;
    }
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
    const pvdKey = options.pvdKey || DEFAULT_PVD_KEY;
    const defaultPvd = options.defaultPvd || 0;
    const isEN = options.isEN || false;

    let dataObj = null;
    let detectedPvd = null;

    if (parsed.data && typeof parsed.data === 'object' && parsed.data[storageKey]) {
      try {
        dataObj =
          typeof parsed.data[storageKey] === 'string' ? JSON.parse(parsed.data[storageKey]) : parsed.data[storageKey];
      } catch (_e) {}
      if (parsed.data[pvdKey]) {
        const p = Number.parseFloat(parsed.data[pvdKey]);
        if (!Number.isNaN(p) && p >= 0 && p <= 100) detectedPvd = p;
      }
    } else if (parsed[storageKey]) {
      try {
        dataObj = typeof parsed[storageKey] === 'string' ? JSON.parse(parsed[storageKey]) : parsed[storageKey];
      } catch (_e) {}
      if (parsed[pvdKey]) {
        const p = Number.parseFloat(parsed[pvdKey]);
        if (!Number.isNaN(p) && p >= 0 && p <= 100) detectedPvd = p;
      }
    } else if (
      parsed.data &&
      typeof parsed.data === 'object' &&
      (Array.isArray(parsed.data.incomes) || Array.isArray(parsed.data.expenses))
    ) {
      dataObj = parsed.data;
    } else if (Array.isArray(parsed.incomes) || Array.isArray(parsed.expenses)) {
      dataObj = parsed;
    }

    if (!dataObj || (!Array.isArray(dataObj.incomes) && !Array.isArray(dataObj.expenses))) {
      return null;
    }

    if (detectedPvd === null) {
      if (
        typeof dataObj.pvdPercent === 'number' &&
        !Number.isNaN(dataObj.pvdPercent) &&
        dataObj.pvdPercent >= 0 &&
        dataObj.pvdPercent <= 100
      ) {
        detectedPvd = dataObj.pvdPercent;
      } else if (
        typeof parsed.pvdPercent === 'number' &&
        !Number.isNaN(parsed.pvdPercent) &&
        parsed.pvdPercent >= 0 &&
        parsed.pvdPercent <= 100
      ) {
        detectedPvd = parsed.pvdPercent;
      }
    }

    const incomes = Array.isArray(dataObj.incomes)
      ? dataObj.incomes.map((it, idx) => ({
          name: String(it.name || (isEN ? `Income ${idx + 1}` : `รายได้ ${idx + 1}`)),
          value: Math.max(0, Number.parseFloat(it.value) || 0),
          isSalary: !!it.isSalary || idx === 0,
        }))
      : [];

    const expenses = Array.isArray(dataObj.expenses)
      ? dataObj.expenses.map((it, idx) => {
          const aType = getAutoType(it);
          return {
            name: String(it.name || (isEN ? `Expense ${idx + 1}` : `ค่าใช้จ่าย ${idx + 1}`)),
            value: Math.max(0, Number.parseFloat(it.value) || 0),
            auto: !!aType || !!it.auto,
            autoType: aType || undefined,
          };
        })
      : [];

    if (!expenses.some((e) => getAutoType(e) === 'tax')) {
      expenses.unshift({ name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' });
    }
    if (!expenses.some((e) => getAutoType(e) === 'sso')) {
      expenses.unshift({ name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' });
    }
    if (!expenses.some((e) => getAutoType(e) === 'pvd')) {
      expenses.unshift({ name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' });
    }
    expenses.forEach((e) => {
      const aType = getAutoType(e);
      if (aType) {
        e.auto = true;
        e.autoType = aType;
        e.name = aType === 'tax' ? AUTO_TAX_NAME_TH : aType === 'sso' ? AUTO_SSO_NAME_TH : AUTO_PVD_NAME_TH;
      }
    });

    const savings = Array.isArray(dataObj.savings)
      ? dataObj.savings.map((it, idx) => ({
          name: String(it.name || (isEN ? `Savings ${idx + 1}` : `เงินออม ${idx + 1}`)),
          value: Math.max(0, Number.parseFloat(it.value) || 0),
        }))
      : [];

    const manualOverrides =
      dataObj.manualOverrides && typeof dataObj.manualOverrides === 'object'
        ? { tax: !!dataObj.manualOverrides.tax, sso: !!dataObj.manualOverrides.sso, pvd: !!dataObj.manualOverrides.pvd }
        : { tax: false, sso: false, pvd: false };

    const showEmergencyRunway = typeof dataObj.showEmergencyRunway === 'boolean' ? dataObj.showEmergencyRunway : false;
    const currentEmergencyReserve =
      Number(dataObj.currentEmergencyReserve) >= 0 ? Number(dataObj.currentEmergencyReserve) : 0;

    return {
      incomes,
      expenses,
      savings,
      manualOverrides,
      showEmergencyRunway,
      currentEmergencyReserve,
      pvdPercent: detectedPvd !== null ? detectedPvd : defaultPvd,
    };
  }

  /**
   * Parses CSV text into a normalized candidate budget object.
   * @param {string} text - Raw CSV content
   * @param {{ fileName?: string, defaultPvd?: number, isEN?: boolean }} [options]
   * @returns {BudgetImportCandidate|null} Candidate budget object or null
   */
  function parseImportCSV(text, options = {}) {
    if (typeof text !== 'string' || !text.trim()) {
      return null;
    }

    const fileName = options.fileName || 'data.csv';
    const defaultPvd = options.defaultPvd || 0;

    // Check if external Thai Bank Statement parser is available
    if (global.MoneyApp && typeof global.MoneyApp.detectAndParseThaiBankStatement === 'function') {
      const bankRes = global.MoneyApp.detectAndParseThaiBankStatement(text, fileName);
      if (bankRes?.isBankStatement && bankRes.candidate) {
        return {
          ...bankRes.candidate,
          isBankStatement: true,
          bankName: bankRes.bankName,
          format: `${bankRes.bankName} CSV`,
        };
      }
    }

    const rows = parseCSVRows(text);
    if (rows.length === 0) {
      return null;
    }

    let headerIdx = -1;
    let colMap = null;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const row = rows[i];
      const rowStr = row.join(' ').toLowerCase();
      if (
        rowStr.includes('category') ||
        rowStr.includes('หมวด') ||
        rowStr.includes('item') ||
        rowStr.includes('รายการ') ||
        rowStr.includes('amount') ||
        rowStr.includes('จำนวน')
      ) {
        headerIdx = i;
        colMap = detectColumns(row);
        break;
      }
    }

    if (!colMap) {
      colMap = { catCol: 0, itemCol: 1, amtCol: 2, noteCol: 3 };
    }

    const startIdx = headerIdx >= 0 ? headerIdx + 1 : 0;
    const candidate = {
      incomes: [],
      expenses: [],
      savings: [],
      manualOverrides: { tax: false, sso: false, pvd: false },
      showEmergencyRunway: false,
      currentEmergencyReserve: 0,
      pvdPercent: defaultPvd,
      format: 'CSV',
    };

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

      const cat = cleanField(row[colMap.catCol] || '');
      const item = cleanField(row[colMap.itemCol] || '');
      const amount = cleanAmount(row[colMap.amtCol]);
      const note = cleanField(row[colMap.noteCol] || '');

      if (!item && amount === 0) continue;

      const isRunwayCat =
        cat.toLowerCase().includes('runway') || cat.includes('เงินสำรอง') || cat.includes('สำรองฉุกเฉิน');
      if (isRunwayCat) {
        if (item.toLowerCase().includes('runway') || item.includes('ระยะเวลา')) {
          if (amount > 0) candidate.showEmergencyRunway = true;
        } else if (
          item.toLowerCase().includes('reserve') ||
          item.includes('เงินสำรองฉุกเฉิน') ||
          item.includes('สำรองฉุกเฉิน') ||
          item.includes('เงินสำรอง')
        ) {
          candidate.currentEmergencyReserve = amount;
          if (amount > 0) candidate.showEmergencyRunway = true;
        }
        continue;
      }

      if (isSubtotalRow(cat, item)) continue;

      const combinedText = `${item} ${note}`;
      const isPvdText = /(?:pvd|provident\s*fund|กองทุนสำรองเลี้ยงชีพ)/i.test(combinedText);
      if (isPvdText) {
        const pvdMatch =
          combinedText.match(/(?:pvd|provident\s*fund|กองทุนสำรองเลี้ยงชีพ).*?\(?(\d+(?:\.\d+)?)\s*%\)?/i) ||
          combinedText.match(/(\d+(?:\.\d+)?)\s*%/);
        if (pvdMatch) {
          const pct = Number.parseFloat(pvdMatch[1]);
          if (!Number.isNaN(pct) && pct >= 0 && pct <= 100) {
            candidate.pvdPercent = pct;
          }
        }
      }

      const isIncomeCat = cat.toLowerCase().includes('income') || cat.includes('รายได้');
      const isExpenseCat = cat.toLowerCase().includes('expense') || cat.includes('ค่าใช้จ่าย') || cat.includes('รายจ่าย');
      const isSavingCat = cat.toLowerCase().includes('saving') || cat.includes('เงินออม') || cat.includes('ออม');

      if (isIncomeCat) {
        const isSal =
          note.toLowerCase().includes('salary') ||
          note.includes('เงินเดือน') ||
          item.toLowerCase().includes('salary') ||
          item.includes('เงินเดือน');
        candidate.incomes.push({ name: item, value: amount, isSalary: isSal });
      } else if (isExpenseCat) {
        const aType =
          getAutoType({ name: item }) ||
          (note.toLowerCase().includes('tax') || note.includes('ภาษี')
            ? 'tax'
            : note.toLowerCase().includes('sso') || note.includes('ประกันสังคม')
              ? 'sso'
              : note.toLowerCase().includes('pvd') || note.includes('กองทุนสำรองเลี้ยงชีพ')
                ? 'pvd'
                : null);
        candidate.expenses.push({
          name: item,
          value: amount,
          auto: !!aType,
          autoType: aType || undefined,
        });
      } else if (isSavingCat) {
        candidate.savings.push({ name: item, value: amount });
      } else {
        if (
          item.toLowerCase().includes('salary') ||
          item.includes('เงินเดือน') ||
          note.toLowerCase().includes('salary') ||
          note.includes('เงินเดือน')
        ) {
          candidate.incomes.push({ name: item, value: amount, isSalary: true });
        } else if (item.toLowerCase().includes('saving') || item.includes('เงินออม') || item.includes('สำรอง')) {
          candidate.savings.push({ name: item, value: amount });
        } else {
          const aType = getAutoType({ name: item });
          candidate.expenses.push({
            name: item,
            value: amount,
            auto: !!aType,
            autoType: aType || undefined,
          });
        }
      }
    }

    if (!candidate.expenses.some((e) => getAutoType(e) === 'tax')) {
      candidate.expenses.unshift({ name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' });
    }
    if (!candidate.expenses.some((e) => getAutoType(e) === 'sso')) {
      candidate.expenses.unshift({ name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' });
    }
    if (!candidate.expenses.some((e) => getAutoType(e) === 'pvd')) {
      candidate.expenses.unshift({ name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' });
    }
    candidate.expenses.forEach((e) => {
      const aType = getAutoType(e);
      if (aType) {
        e.auto = true;
        e.autoType = aType;
        e.name = aType === 'tax' ? AUTO_TAX_NAME_TH : aType === 'sso' ? AUTO_SSO_NAME_TH : AUTO_PVD_NAME_TH;
      }
    });

    if (candidate.incomes.length > 0 && !candidate.incomes.some((i) => i.isSalary)) {
      candidate.incomes[0].isSalary = true;
    }

    const nonAutoExp = candidate.expenses.filter((e) => !getAutoType(e));
    if (candidate.incomes.length === 0 && nonAutoExp.length === 0 && candidate.savings.length === 0) {
      return null;
    }

    return candidate;
  }

  const BudgetImport = {
    parseCSVRows,
    detectColumns,
    cleanField,
    cleanAmount,
    isSubtotalRow,
    parseImportJSON,
    parseImportCSV,
    getAutoType,
  };

  // Attach to MoneyApp and global namespace
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.BudgetImport = BudgetImport;
  global.MoneyApp.parseCSVRows = parseCSVRows;
  global.MoneyApp.detectColumns = detectColumns;
  global.MoneyApp.cleanAmount = cleanAmount;

  if (typeof global !== 'undefined') {
    if (typeof global.BudgetImport === 'undefined') {
      global.BudgetImport = BudgetImport;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
