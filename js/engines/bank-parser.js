/**
 * Money Superapp - Thai Mobile Banking CSV Statement Parser Engine
 * Auto-detects and parses statements from KBank, SCB, Krungthai (KTB), KKP/Dime,
 * and generic CSV bank exports, extracting inflows, outflows, and candidate line items.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var parseNum = (val) => {
    if (global.MoneyApp && typeof global.MoneyApp.parseNum === 'function') {
      return global.MoneyApp.parseNum(val);
    }
    if (typeof val === 'number') return Number.isNaN(val) ? 0 : val;
    var clean = String(val || '')
      .replace(/,/g, '')
      .trim();
    var n = Number.parseFloat(clean);
    return Number.isNaN(n) ? 0 : n;
  };

  /**
   * Auto-detects and parses Thai Mobile Banking CSV Statements (KBank, SCB, Krungthai, KKP, etc.)
   *
   * @param {string} csvText - Raw CSV text
   * @param {string} [fileName=''] - File name for bank brand heuristics
   * @returns {Object} Structured bank statement data or { isBankStatement: false }
   */
  function detectAndParseThaiBankStatement(csvText, fileName) {
    if (typeof csvText !== 'string' || !csvText.trim()) {
      return { isBankStatement: false };
    }
    fileName = (fileName || '').toLowerCase();

    // Strip BOM
    if (csvText.charCodeAt(0) === 0xfeff) {
      csvText = csvText.slice(1);
    }

    var rows = [];
    var currentRow = [];
    var currentVal = '';
    var inQuotes = false;
    var i = 0;
    var len = csvText.length;
    var char;

    while (i < len) {
      char = csvText[i];
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

    if (rows.length < 2) {
      return { isBankStatement: false };
    }

    var headerIdx = -1;
    var headerRow = null;
    var r;
    var rStr;
    var isDate;
    var isDesc;
    var isCashFlow;

    for (r = 0; r < Math.min(10, rows.length); r++) {
      rStr = rows[r].join(' ').toLowerCase();
      isDate = rStr.includes('date') || rStr.includes('วัน');
      isDesc =
        rStr.includes('description') ||
        rStr.includes('detail') ||
        rStr.includes('รายการ') ||
        rStr.includes('รายละเอียด') ||
        rStr.includes('transaction');
      isCashFlow =
        rStr.includes('withdrawal') ||
        rStr.includes('deposit') ||
        rStr.includes('debit') ||
        rStr.includes('credit') ||
        rStr.includes('ถอน') ||
        rStr.includes('ฝาก') ||
        rStr.includes('amount') ||
        rStr.includes('จำนวนเงิน');

      if (
        isDate &&
        (isDesc || isCashFlow) &&
        (rStr.includes('withdraw') ||
          rStr.includes('deposit') ||
          rStr.includes('debit') ||
          rStr.includes('credit') ||
          rStr.includes('ถอน') ||
          rStr.includes('ฝาก') ||
          rStr.includes('balance') ||
          rStr.includes('คงเหลือ') ||
          rStr.includes('amount') ||
          rStr.includes('จำนวนเงิน'))
      ) {
        headerIdx = r;
        headerRow = rows[r];
        break;
      }
    }

    if (headerIdx === -1 || !headerRow) {
      return { isBankStatement: false };
    }

    // Determine bank brand
    var fullHeaderStr = `${headerRow.join(' ')} ${fileName}`.toLowerCase();
    var bankCode = 'generic_bank';
    var bankName = 'Bank Statement';

    if (
      fullHeaderStr.includes('kbank') ||
      fullHeaderStr.includes('k plus') ||
      fullHeaderStr.includes('kasikorn') ||
      (fullHeaderStr.includes('channel') && fullHeaderStr.includes('outstanding balance'))
    ) {
      bankCode = 'kbank';
      bankName = 'Kasikornbank (KBank)';
    } else if (
      fullHeaderStr.includes('scb') ||
      fullHeaderStr.includes('siam commercial') ||
      fullHeaderStr.includes('easy net') ||
      fullHeaderStr.includes('จำนวนเงินที่ถอน')
    ) {
      bankCode = 'scb';
      bankName = 'Siam Commercial Bank (SCB)';
    } else if (
      fullHeaderStr.includes('krungthai') ||
      fullHeaderStr.includes('ktb') ||
      fullHeaderStr.includes('next') ||
      (fullHeaderStr.includes('debit') && fullHeaderStr.includes('credit') && fullHeaderStr.includes('balance'))
    ) {
      bankCode = 'krungthai';
      bankName = 'Krungthai Bank (KTB)';
    } else if (fullHeaderStr.includes('kkp') || fullHeaderStr.includes('dime') || fullHeaderStr.includes('kiatnakin')) {
      bankCode = 'kkp';
      bankName = 'KKP Mobile / Dime';
    }

    // Map columns
    var dateCol = -1;
    var descCol = -1;
    var withdrawCol = -1;
    var depositCol = -1;
    var amountCol = -1;
    var c;
    var colLower;

    for (c = 0; c < headerRow.length; c++) {
      colLower = headerRow[c].toLowerCase();
      if (dateCol === -1 && (colLower.includes('date') || colLower.includes('วัน'))) {
        dateCol = c;
      } else if (
        colLower.includes('description') ||
        colLower.includes('รายละเอียด') ||
        colLower.includes('particulars') ||
        colLower.includes('narrative') ||
        (descCol === -1 &&
          (colLower.includes('detail') || colLower.includes('รายการ') || colLower.includes('transaction')) &&
          !colLower.includes('type') &&
          !colLower.includes('ประเภท'))
      ) {
        descCol = c;
      } else if (
        withdrawCol === -1 &&
        (colLower.includes('withdrawal') ||
          colLower.includes('debit') ||
          colLower.includes('ถอน') ||
          colLower.includes('จ่าย'))
      ) {
        withdrawCol = c;
      } else if (
        depositCol === -1 &&
        (colLower.includes('deposit') ||
          colLower.includes('credit') ||
          colLower.includes('ฝาก') ||
          colLower.includes('รับ'))
      ) {
        depositCol = c;
      } else if (
        amountCol === -1 &&
        (colLower.includes('amount') || colLower.includes('จำนวนเงิน') || colLower.includes('ยอดเงิน'))
      ) {
        amountCol = c;
      }
    }

    // If description wasn't found, find first non-amount non-date column
    if (descCol === -1) {
      for (c = 0; c < headerRow.length; c++) {
        if (c !== dateCol && c !== withdrawCol && c !== depositCol && c !== amountCol) {
          descCol = c;
          break;
        }
      }
    }

    var transactions = [];
    var incomes = [];
    var expenses = [];
    var totalInflow = 0;
    var totalOutflow = 0;
    var row;
    var dateVal;
    var descVal;
    var withdrawVal;
    var depositVal;
    var amountVal;
    var txAmt;

    for (r = headerIdx + 1; r < rows.length; r++) {
      row = rows[r];
      if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

      dateVal = dateCol >= 0 && row[dateCol] ? row[dateCol].trim() : '';
      descVal = descCol >= 0 && row[descCol] ? row[descCol].trim() : '';
      withdrawVal = withdrawCol >= 0 && row[withdrawCol] ? parseNum(row[withdrawCol]) : 0;
      depositVal = depositCol >= 0 && row[depositCol] ? parseNum(row[depositCol]) : 0;
      amountVal = amountCol >= 0 && row[amountCol] ? parseNum(row[amountCol]) : 0;

      if (!descVal && withdrawVal === 0 && depositVal === 0 && amountVal === 0) continue;

      if (withdrawCol >= 0 && depositCol >= 0) {
        if (withdrawVal > 0) {
          expenses.push({
            name: descVal || 'Expense',
            value: Math.round(withdrawVal * 100) / 100,
            date: dateVal,
          });
          totalOutflow += withdrawVal;
          transactions.push({ type: 'debit', amount: withdrawVal, description: descVal, date: dateVal });
        }
        if (depositVal > 0) {
          incomes.push({
            name: descVal || 'Income',
            value: Math.round(depositVal * 100) / 100,
            date: dateVal,
          });
          totalInflow += depositVal;
          transactions.push({ type: 'credit', amount: depositVal, description: descVal, date: dateVal });
        }
      } else if (amountCol >= 0) {
        if (amountVal < 0) {
          txAmt = Math.abs(amountVal);
          expenses.push({
            name: descVal || 'Expense',
            value: Math.round(txAmt * 100) / 100,
            date: dateVal,
          });
          totalOutflow += txAmt;
          transactions.push({ type: 'debit', amount: txAmt, description: descVal, date: dateVal });
        } else if (amountVal > 0) {
          incomes.push({
            name: descVal || 'Income',
            value: Math.round(amountVal * 100) / 100,
            date: dateVal,
          });
          totalInflow += amountVal;
          transactions.push({ type: 'credit', amount: amountVal, description: descVal, date: dateVal });
        }
      }
    }

    if (transactions.length === 0) {
      return { isBankStatement: false };
    }

    return {
      isBankStatement: true,
      bankCode: bankCode,
      bankName: bankName,
      summary: {
        totalInflow: Math.round(totalInflow * 100) / 100,
        totalOutflow: Math.round(totalOutflow * 100) / 100,
        transactionCount: transactions.length,
      },
      candidate: {
        incomes: incomes,
        expenses: expenses,
        savings: [],
        manualOverrides: { tax: false, sso: false, pvd: false },
        showEmergencyRunway: false,
        currentEmergencyReserve: 0,
      },
      transactions: transactions,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.detectAndParseThaiBankStatement = detectAndParseThaiBankStatement;

  if (typeof global !== 'undefined') {
    if (typeof global.detectAndParseThaiBankStatement === 'undefined') {
      global.detectAndParseThaiBankStatement = detectAndParseThaiBankStatement;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
