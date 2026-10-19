/**
 * @typedef {Object} TaxWorksheetReportContext
 * @property {number} [netIncome] - Annual net taxable income in THB
 * @property {number} [tax] - Total PIT liability in THB
 * @property {number} [effRate] - Effective tax rate percentage (0-100)
 * @property {number} [withheldTax] - Pre-withheld tax (50 Tawi) in THB
 * @property {{ tiers?: Array<{ labelTh: string, labelEn: string, rate: number, ratePct: number, taxable: number, tax: number }>, topMarginalRate?: number }} [wf] - Progressive bracket breakdown
 * @property {{ status: 'refund'|'payable'|'balanced', amount: number }} [refundMetrics] - Net refund or additional payable
 * @property {boolean} [isEn] - Language flag
 * @property {string} [unit] - Currency unit label
 */

/**
 * @typedef {Object} TaxWorksheetDividendContext
 * @property {string} [lang] - Language code ('th' | 'en')
 * @property {(val: number) => string} [formatMoney] - Money formatting helper
 */

/**
 * @typedef {Object} TaxWorksheetEFilingContext
 * @property {string} [lang] - Language code ('th' | 'en')
 * @property {string} [incomeMode] - 'monthly' or 'yearly'
 * @property {number} [salary] - Monthly salary in THB
 * @property {number} [bonus] - Annual bonus in THB
 * @property {number} [yearlyIncome] - Gross yearly base income in THB
 * @property {number} [yearlyBonus] - Gross yearly bonus in THB
 * @property {Object} [deductions] - Deductions override object
 * @property {number} [withheldTax] - Total withheld tax in THB
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
   * Formats report date with Thai or English month and Buddhist/Gregorian year.
   * @param {Date|number|string} d - Date object, timestamp, or string
   * @param {'th'|'en'|string} [lang='th'] - Language code
   * @returns {string} Formatted timestamp string (e.g. "19 ต.ค. 2569 08:30")
   */
  function formatReportDate(d, lang) {
    const dateObj = d instanceof Date ? d : new Date(d);
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const day = dateObj.getDate();
    const m = lang === 'en' ? enMonths[dateObj.getMonth()] : thMonths[dateObj.getMonth()];
    const y = lang === 'en' ? dateObj.getFullYear() : dateObj.getFullYear() + 543;
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day} ${m} ${y} ${hh}:${mm}`;
  }

  function showCopyFeedback(btn) {
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '✓';
    setTimeout(() => {
      btn.innerHTML = original;
    }, 1200);
  }

  function copyEFilingField(valElementId, btnEl) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(valElementId);
    if (!el) return;
    const raw = el.dataset.raw || el.textContent.replace(/[^0-9.-]/g, '');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(raw).then(() => {
        showCopyFeedback(btnEl);
      });
    } else {
      const input = document.createElement('input');
      input.value = raw;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showCopyFeedback(btnEl);
    }
  }

  function copyAllEFilingSummary(context = {}) {
    if (typeof document === 'undefined') return;
    const formatMoney = context.formatMoney || global.formatMoney || ((v) => String(v));
    const btn = document.getElementById('btnCopyAllEFiling');
    const v401 = document.getElementById('valEf401')?.dataset.raw || '0';
    const v402 = document.getElementById('valEf402')?.dataset.raw || '0';
    const v404b = document.getElementById('valEf404b')?.dataset.raw || '0';
    const grpA = document.getElementById('valEfGroupA')?.dataset.raw || '0';
    const grpB = document.getElementById('valEfGroupB')?.dataset.raw || '0';
    const grpC = document.getElementById('valEfGroupC')?.dataset.raw || '0';
    const grpD = document.getElementById('valEfGroupD')?.dataset.raw || '0';
    const netBal = document.getElementById('valEfNetBalance')?.textContent || '';

    const summary = [
      '=== Money Superapp ภ.ง.ด. 90/91 e-Filing Worksheet ===',
      `[เงินได้ 40(1)]: ${formatMoney(v401)} บาท`,
      `[เงินได้ 40(2)]: ${formatMoney(v402)} บาท`,
      `[เงินได้ 40(4)(ข)]: ${formatMoney(v404b)} บาท`,
      `[ลดหย่อนกลุ่ม A ตนเอง/ครอบครัว]: ${formatMoney(grpA)} บาท`,
      `[ลดหย่อนกลุ่ม B ประกัน/กองทุน]: ${formatMoney(grpB)} บาท`,
      `[ลดหย่อนกลุ่ม C ดอกเบี้ยบ้าน]: ${formatMoney(grpC)} บาท`,
      `[ลดหย่อนกลุ่ม D เงินบริจาค]: ${formatMoney(grpD)} บาท`,
      `[ผลลัพธ์สุทธิ]: ${netBal}`,
    ].join('\n');

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summary).then(() => {
        showCopyFeedback(btn);
      });
    }
  }

  /**
   * Updates Section 47 ทวิ Dividend Tax Credit interactive preview and recommendation UI.
   * @param {TaxWorksheetDividendContext} [context]
   */
  function updateDividendTaxCreditUI(context = {}) {
    if (typeof document === 'undefined') return;
    const inpAmt = document.getElementById('inpDividendAmount');
    const selCit = document.getElementById('selCitRate');
    const factorPreview = document.getElementById('lbl-credit-factor-preview');
    const valFinalTax = document.getElementById('val-opt-final-tax');
    const valClaimCredit = document.getElementById('val-opt-claim-credit');
    const verdictBox = document.getElementById('divCreditVerdictBox');
    const isEn = (context.lang || global.LANG) === 'en';
    const formatMoney = context.formatMoney || global.formatMoney || ((v) => String(v));

    const dividendAmt = inpAmt ? parseNum(inpAmt.value) : 0;
    const citRate = selCit ? parseNum(selCit.value) : 0.2;

    if (factorPreview) {
      if (citRate === 0.2) factorPreview.textContent = isEn ? '25% credit (x 20/80)' : 'เครดิต 25% (x 20/80)';
      else if (citRate === 0.25)
        factorPreview.textContent = isEn ? '33.33% credit (x 25/75)' : 'เครดิต 33.33% (x 25/75)';
      else if (citRate === 0.15)
        factorPreview.textContent = isEn ? '17.65% credit (x 15/85)' : 'เครดิต 17.65% (x 15/85)';
      else factorPreview.textContent = isEn ? '0% credit (BOI Exempt)' : 'เครดิต 0% (ยกเว้นภาษี BOI)';
    }

    let baseNet = parseNum(document.getElementById('netIncome')?.textContent);
    const chkApply = document.getElementById('chkApplyDividendToTax');
    const badgeStatus = document.getElementById('badge-applied-status');
    if (badgeStatus) {
      if (chkApply?.checked) {
        badgeStatus.textContent = isEn ? 'ACTIVE' : 'เปิดใช้งาน';
        badgeStatus.style.color = 'var(--ok)';
      } else {
        badgeStatus.textContent = isEn ? 'OFF' : 'ปิดอยู่';
        badgeStatus.style.color = 'var(--ink-dim)';
      }
    }
    if (chkApply?.checked && dividendAmt > 0) {
      const factor = citRate > 0 && citRate < 1 ? citRate / (1 - citRate) : 0;
      baseNet = Math.max(0, baseNet - Math.round(dividendAmt * (1 + factor)));
    }

    const regularWithheld = parseNum(document.getElementById('withheldTax')?.value);

    const res = global.MoneyApp?.calculateThaiDividendTaxCredit?.({
      dividends: dividendAmt,
      corporateTaxRate: citRate,
      otherTaxableNetIncome: baseNet,
      regularTaxWithheld: regularWithheld,
    }) ?? {
      totalDividendWht: dividendAmt * 0.1,
      netTaxAdvantage: 0,
      isClaimAdvantageous: false,
      optimalChoice: 'final_tax',
      scenarioClaimCredit: { netPayableOrRefund: 0 },
    };

    if (valFinalTax) {
      valFinalTax.textContent = `${formatMoney(res.totalDividendWht)} ${isEn ? 'THB' : 'บาท'}`;
    }

    if (valClaimCredit) {
      const netBal = res.scenarioClaimCredit.netPayableOrRefund;
      if (netBal < 0) {
        valClaimCredit.textContent = `${isEn ? 'Refund ' : 'ขอคืน '}+${formatMoney(Math.abs(netBal))} ${isEn ? 'THB' : 'บาท'}`;
        valClaimCredit.style.color = 'var(--ok)';
      } else if (netBal > 0) {
        valClaimCredit.textContent = `${isEn ? 'Payable ' : 'ชำระเพิ่ม '}${formatMoney(netBal)} ${isEn ? 'THB' : 'บาท'}`;
        valClaimCredit.style.color = 'var(--danger)';
      } else {
        valClaimCredit.textContent = `0 ${isEn ? 'THB' : 'บาท'}`;
        valClaimCredit.style.color = 'var(--ink)';
      }
    }

    if (verdictBox) {
      if (dividendAmt <= 0) {
        verdictBox.style.background = 'var(--panel-2)';
        verdictBox.style.borderColor = 'var(--line)';
        verdictBox.style.color = 'var(--ink-dim)';
        verdictBox.innerHTML = `💡 <strong>${isEn ? 'Guidance:' : 'คำแนะนำ:'}</strong> ${isEn ? 'Enter annual dividend amount to compare Section 47 bis tax refund.' : 'กรอกจำนวนเงินปันผลเพื่อเปรียบเทียบสิทธิประโยชน์ทางภาษี'}`;
      } else if (res.isClaimAdvantageous) {
        verdictBox.style.background = 'var(--ok-dim)';
        verdictBox.style.borderColor = 'var(--ok)';
        verdictBox.style.color = 'var(--ok)';
        verdictBox.innerHTML = `🎉 <strong>${isEn ? 'Recommended: Claim Dividend Tax Credit (Sec 47 bis)' : 'แนะนำ: ยื่นเครดิตภาษีเงินปันผล (ม.47 ทวิ)'}</strong><br>${isEn ? `Claiming tax credit yields a <strong>+${formatMoney(res.netTaxAdvantage)} THB</strong> better outcome (refund/savings) than paying 10% Final Tax!` : `การนำเงินปันผลมายื่นแบบจะได้ประโยชน์ภาษีมากกว่าเลือกหัก 10% จบ ถึง <strong>+${formatMoney(res.netTaxAdvantage)} บาท</strong>!`}`;
      } else if (res.optimalChoice === 'final_tax') {
        verdictBox.style.background = 'var(--warn-dim)';
        verdictBox.style.borderColor = 'var(--warn)';
        verdictBox.style.color = 'var(--warn)';
        verdictBox.innerHTML = `⚠️ <strong>${isEn ? 'Recommended: Final Tax 10% (Do NOT Include)' : 'แนะนำ: เลือกหักภาษี ณ ที่จ่าย 10% จบ (Final Tax)'}</strong><br>${isEn ? `Your personal tax bracket exceeds the company CIT rate. Keeping Final Tax saves you <strong>${formatMoney(res.netTaxAdvantage)} THB</strong> compared to filing!` : `เนื่องจากฐานภาษีบุคคลของคุณสูงกว่าอัตราภาษีนิติบุคคล การเลือกหัก 10% จบจะช่วยประหยัดภาษีกว่าการนำมายื่นรวมถึง <strong>${formatMoney(res.netTaxAdvantage)} บาท</strong>`}`;
      } else {
        verdictBox.style.background = 'var(--panel-2)';
        verdictBox.style.borderColor = 'var(--line)';
        verdictBox.style.color = 'var(--ink-dim)';
        verdictBox.innerHTML = `💡 <strong>${isEn ? 'Outcome Balanced:' : 'ผลลัพธ์เท่ากันพอดี:'}</strong> ${isEn ? 'Both options result in the exact same tax liability.' : 'ทั้งสองทางเลือกส่งผลให้ภาระภาษีรวมเท่ากันพอดี'}`;
      }
    }

    if (chkApply?.checked) {
      if (typeof context.calculateTax === 'function') context.calculateTax();
      else if (typeof global.calculateTax === 'function') global.calculateTax();
    }
  }

  /**
   * Updates ภ.ง.ด. 90/91 e-Filing Worksheet view, Section 47 500k ceiling pool, and preflight checklist.
   * @param {TaxWorksheetEFilingContext} [context]
   */
  function updateEFilingWorksheetView(context = {}) {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('panelEFilingWorksheet');
    if (!panel || !global.MoneyApp?.calculateThaiEFilingWorksheet) return;

    const isEn = (context.lang || global.LANG) === 'en';
    const curUnit = isEn ? 'THB' : 'บาท';
    const formatMoney = context.formatMoney || global.formatMoney || ((v) => String(v));
    const incomeMode = context.incomeMode || global.incomeMode || 'monthly';
    const lastCalculatedDeductions = context.lastCalculatedDeductions || global.lastCalculatedDeductions || {};
    const deductions = context.deductionsArg || lastCalculatedDeductions;
    const preflightState = context.preflightState || global.preflightState || {};

    const isDivApplied = Boolean(document.getElementById('chkApplyDividendToTax')?.checked);
    const divAmount = parseNum(document.getElementById('inpDividendAmount')?.value);
    const citRate = parseNum(document.getElementById('selCitRate')?.value);
    const salaryVal = parseNum(document.getElementById('salary')?.value);
    const bonusVal = parseNum(document.getElementById('bonus')?.value);
    const yearlyIncVal = parseNum(document.getElementById('yearlyIncome')?.value);
    const yearlyBonusVal = parseNum(document.getElementById('yearlyBonus')?.value);

    const pvdVal =
      deductions?.pvd !== undefined
        ? deductions.pvd
        : incomeMode === 'yearly'
          ? parseNum(document.getElementById('yearlyPvd')?.value)
          : parseNum(document.getElementById('salary')?.value) *
            12 *
            (parseNum(document.getElementById('pvd')?.value) / 100);

    const ssoVal =
      deductions?.sso !== undefined
        ? deductions.sso
        : incomeMode === 'yearly'
          ? parseNum(document.getElementById('yearlySso')?.value)
          : Math.min(
              parseNum(document.getElementById('salary')?.value),
              parseNum(document.getElementById('ssoCap')?.value || 750),
            ) *
            0.05 *
            12;

    const lifeInsVal =
      deductions?.insurance !== undefined
        ? deductions.insurance
        : parseNum(document.getElementById('insuranceDeduct')?.value);

    const rmfVal =
      deductions?.rawFund !== undefined ? deductions.rawFund : parseNum(document.getElementById('fundDeduct')?.value);

    const thaiEsgVal =
      deductions?.thaiEsg !== undefined
        ? deductions.thaiEsg
        : parseNum(document.getElementById('thaiEsgDeduct')?.value);

    const mortgageVal =
      deductions?.mortgage !== undefined
        ? deductions.mortgage
        : parseNum(document.getElementById('mortgageDeduct')?.value);

    const otherVal =
      deductions?.other !== undefined ? deductions.other : parseNum(document.getElementById('otherDeduct')?.value);

    const ws = global.MoneyApp.calculateThaiEFilingWorksheet({
      salary: incomeMode === 'yearly' ? 0 : salaryVal,
      bonus: incomeMode === 'yearly' ? 0 : bonusVal,
      yearlyIncome: incomeMode === 'yearly' ? yearlyIncVal + yearlyBonusVal : 0,
      freelance402: 0,
      dividend404b: isDivApplied ? divAmount : 0,
      dividendCitRate: citRate,
      applyDividendCredit: isDivApplied,
      pvd: pvdVal,
      sso: ssoVal,
      lifeInsurance: lifeInsVal,
      rmf: rmfVal,
      thaiEsg: thaiEsgVal,
      homeLoanInterest: mortgageVal,
      donationGeneral: otherVal,
      taxWithheld50Tawi: parseNum(document.getElementById('withheldTax')?.value),
    });

    // Phase 74: Statutory 500k Retirement Deductions Ceiling Pool Warning Bridge
    const pool =
      ws.retirementPool ||
      (global.MoneyApp.calculateRetirementCeilingPool
        ? global.MoneyApp.calculateRetirementCeilingPool({ pvd: pvdVal, rmf: rmfVal })
        : {
            pvd: pvdVal,
            rmf: rmfVal,
            ssf: 0,
            totalRaw: pvdVal + rmfVal,
            effectiveTotal: Math.min(500000, pvdVal + rmfVal),
            excess: Math.max(0, pvdVal + rmfVal - 500000),
            headroom: Math.max(0, 500000 - (pvdVal + rmfVal)),
            utilizationPct: Math.min(100, ((pvdVal + rmfVal) / 500000) * 100),
            status: pvdVal + rmfVal > 500000 ? 'exceeded' : pvdVal + rmfVal >= 400000 ? 'warning' : 'safe',
            isExceeded: pvdVal + rmfVal > 500000,
          });

    const elPoolTitle = document.getElementById('lblPool500kTitle');
    if (elPoolTitle) {
      elPoolTitle.textContent = isEn
        ? 'Statutory Retirement Deductions Ceiling 500,000 THB (Section 47 Thai Revenue Code)'
        : 'เพดานลดหย่อนกลุ่มเกษียณ 500,000 บาท (ม.47 แห่งประมวลรัษฎากร)';
    }

    const badgePool = document.getElementById('badgePoolStatus');
    if (badgePool) {
      if (pool.status === 'exceeded') {
        badgePool.textContent = isEn ? 'Exceeded Cap (Over 500k)' : 'เกินเพดาน (เกิน 500k)';
        badgePool.style.background = 'rgba(239, 68, 68, 0.15)';
        badgePool.style.color = '#ef4444';
        badgePool.style.borderColor = '#ef4444';
      } else if (pool.status === 'warning') {
        badgePool.textContent = isEn ? 'Near Limit (>=80%)' : 'ใกล้เต็มสิทธิ์ (>=80%)';
        badgePool.style.background = 'var(--warn-dim)';
        badgePool.style.color = 'var(--warn)';
        badgePool.style.borderColor = 'var(--warn)';
      } else {
        badgePool.textContent = isEn ? 'Safe (<80%)' : 'ปลอดภัย (Safe)';
        badgePool.style.background = 'var(--ok-dim)';
        badgePool.style.color = 'var(--ok)';
        badgePool.style.borderColor = 'var(--ok)';
      }
    }

    const elPoolComb = document.getElementById('valPoolCombinedText');
    if (elPoolComb) {
      elPoolComb.textContent = `${formatMoney(pool.totalRaw)} / 500,000 ${curUnit}`;
      elPoolComb.style.color = pool.isExceeded ? '#ef4444' : 'var(--ink)';
    }

    const barPool = document.getElementById('barPoolProgress');
    if (barPool) {
      barPool.style.width = `${pool.utilizationPct}%`;
      barPool.style.background =
        pool.status === 'exceeded' ? '#ef4444' : pool.status === 'warning' ? '#f59e0b' : 'var(--core)';
    }

    const elPoolPvd = document.getElementById('valPoolPvd');
    if (elPoolPvd) elPoolPvd.textContent = `${formatMoney(pool.pvd)} ${curUnit}`;

    const elPoolRmf = document.getElementById('valPoolRmf');
    if (elPoolRmf) elPoolRmf.textContent = `${formatMoney(pool.rmf + (pool.ssf || 0))} ${curUnit}`;

    const elPoolHeadroomNotice = document.getElementById('valPoolHeadroomNotice');
    const elPoolHeadroom = document.getElementById('valPoolHeadroom');
    if (elPoolHeadroomNotice && elPoolHeadroom) {
      if (pool.isExceeded) {
        elPoolHeadroomNotice.style.display = 'none';
      } else {
        elPoolHeadroomNotice.style.display = 'block';
        elPoolHeadroom.textContent = formatMoney(pool.headroom);
        elPoolHeadroomNotice.innerHTML = isEn
          ? `💡 Remaining Room: <strong id="valPoolHeadroom" class="font-mono">${formatMoney(pool.headroom)}</strong> THB`
          : `💡 เพดานคงเหลืออีก: <strong id="valPoolHeadroom" class="font-mono">${formatMoney(pool.headroom)}</strong> บาท`;
      }
    }

    const alertExcess = document.getElementById('alertPoolExcessCallout');
    const valExcessAmt = document.getElementById('valPoolExcessAmount');
    const elPoolExcessTitle = document.getElementById('lblPoolExcessTitle');
    const elPoolExcessDesc = document.getElementById('lblPoolExcessDesc');
    if (alertExcess) {
      if (pool.isExceeded) {
        alertExcess.style.display = 'block';
        if (valExcessAmt) valExcessAmt.textContent = `${formatMoney(pool.excess)} ${curUnit}`;
        if (elPoolExcessTitle) {
          elPoolExcessTitle.textContent = isEn
            ? 'Retirement Fund Contributions Exceed Statutory 500k Ceiling'
            : 'มียอดเงินสะสม/ลงทุนเกินเพดานที่กฎหมายกำหนด';
        }
        if (elPoolExcessDesc) {
          elPoolExcessDesc.innerHTML = isEn
            ? `Your combined PVD + SSF + RMF contributions exceed the 500,000 THB Section 47 ceiling by <strong id="valPoolExcessAmount" class="font-mono">${formatMoney(pool.excess)} ${curUnit}</strong>. The Revenue Department will automatically cap your deduction at 500,000 THB.`
            : `คุณมียอดรวม PVD + SSF + RMF เกินเพดาน 500,000 บาท ตาม ม.47 อยู่เป็นจำนวน <strong id="valPoolExcessAmount" class="font-mono">${formatMoney(pool.excess)} ${curUnit}</strong> สรรพากรจะตัดส่วนเกินนี้ออกอัตโนมัติในการยื่นแบบ ภ.ง.ด. 90/91`;
        }
      } else {
        alertExcess.style.display = 'none';
      }
    }

    // Phase 74: Statutory Pre-Flight Checklist Evaluator & Localization
    const elPreflightTitle = document.getElementById('lblPreflightTitle');
    if (elPreflightTitle) {
      elPreflightTitle.textContent = isEn
        ? 'Online Filing Pre-Flight Checklist'
        : 'รายการตรวจสอบก่อนยื่นแบบออนไลน์ (Pre-Flight Checklist)';
    }
    const elBtnCheckAll = document.getElementById('btnCheckAllPreflight');
    if (elBtnCheckAll) elBtnCheckAll.textContent = isEn ? '✓ Check All' : '✓ ตรวจทั้งหมด';
    const elBtnResetPre = document.getElementById('btnResetPreflight');
    if (elBtnResetPre) elBtnResetPre.textContent = isEn ? 'Reset' : 'รีเซ็ต';

    const elChk50Tawi = document.getElementById('lbl-chk-50tawi');
    if (elChk50Tawi) {
      elChk50Tawi.textContent = isEn
        ? '1. Verify 50 Tawi Withholding Certificates from all employers/clients'
        : '1. ตรวจสอบหนังสือรับรองหัก ณ ที่จ่าย (ใบ 50 ทวิ) ครบทุกที่';
    }
    const elSub50Tawi = document.getElementById('sub-chk-50tawi');
    if (elSub50Tawi) {
      elSub50Tawi.textContent = isEn
        ? 'Ensure salary, bonus, freelance income, and tax withheld match physical slips'
        : 'รวมยอดเงินเดือน โบนัส และฟรีแลนซ์ตรงกับเอกสารจริงทุกบริษัท';
    }

    const elChkPool = document.getElementById('lbl-chk-pool500k');
    if (elChkPool) {
      elChkPool.textContent = isEn
        ? '2. Retirement pool (PVD + SSF + RMF) within 500,000 THB ceiling'
        : '2. ยอดกลุ่มกองทุนเกษียณ (PVD + SSF + RMF) ไม่เกินเพดาน 500,000 บาท';
    }
    const elSubPool = document.getElementById('sub-chk-pool500k');
    if (elSubPool) {
      elSubPool.textContent = isEn
        ? 'Compliant with Section 47 ceiling; no non-deductible excess contributions'
        : 'ผ่านเกณฑ์มาตรา 47 แห่งประมวลรัษฎากร ไม่มียอดส่วนเกินตกหล่น';
    }

    const elChkEsg = document.getElementById('lbl-chk-thaiesg');
    if (elChkEsg) {
      elChkEsg.textContent = isEn
        ? '3. ThaiESG funds comply with 300,000 THB & 5-year holding requirements'
        : '3. กองทุนรวมไทยเพื่อความยั่งยืน (ThaiESG) ถูกต้องตามเกณฑ์';
    }
    const elSubEsg = document.getElementById('sub-chk-thaiesg');
    if (elSubEsg) {
      elSubEsg.textContent = isEn
        ? 'Not exceeding 300,000 THB (and 30% of income), held for 5 full calendar years'
        : 'ไม่เกิน 300,000 บาท (และไม่เกิน 30% ของเงินได้) พร้อมถือครองครบ 5 ปีวันชนวัน';
    }

    const elChkConsent = document.getElementById('lbl-chk-consent');
    if (elChkConsent) {
      elChkConsent.textContent = isEn
        ? '4. Confirm consent given to AMCs/insurers to transmit data to Revenue Dept'
        : '4. ยืนยันการให้ความยินยอม (Consent) ส่งข้อมูลลดหย่อนสู่สรรพากร';
    }
    const elSubConsent = document.getElementById('sub-chk-consent');
    if (elSubConsent) {
      elSubConsent.textContent = isEn
        ? 'Opt-in confirmed in banking/fund apps to allow automatic e-Filing pre-population'
        : 'กดยินยอมในแอปพลิเคชัน บลจ. หรือบริษัทประกัน ให้ส่งข้อมูลภาษีออนไลน์อัตโนมัติ';
    }

    const elChkPromptPay = document.getElementById('lbl-chk-promptpay');
    if (elChkPromptPay) {
      elChkPromptPay.textContent = isEn
        ? '5. Link PromptPay with 13-digit Thai National Citizen ID'
        : '5. ผูกบัญชีพร้อมเพย์ด้วยเลขบัตรประชาชน 13 หลัก';
    }
    const elSubPromptPay = document.getElementById('sub-chk-promptpay');
    if (elSubPromptPay) {
      elSubPromptPay.textContent = isEn
        ? 'Enables direct electronic tax refund transfer from the Revenue Department'
        : 'สำหรับการรับเงินภาษีคืนเข้าบัญชีธนาคารโดยตรงจากกรมสรรพากรโดยไม่ต้องรอเช็ค';
    }

    if (global.MoneyApp.evaluateEFilingPreFlightChecklist) {
      const evalRes = global.MoneyApp.evaluateEFilingPreFlightChecklist({
        checks: preflightState,
        retirementPool: pool,
      });

      const chk50 = document.getElementById('chk-ef-50tawi');
      if (chk50) chk50.checked = Boolean(preflightState.doc50Tawi);

      const chkPoolBox = document.getElementById('chk-ef-pool500k');
      if (chkPoolBox) {
        if (pool.isExceeded) {
          chkPoolBox.checked = false;
          chkPoolBox.disabled = true;
        } else {
          chkPoolBox.disabled = false;
          chkPoolBox.checked = Boolean(preflightState.pool500k);
        }
      }

      const chkEsgBox = document.getElementById('chk-ef-thaiesg');
      if (chkEsgBox) chkEsgBox.checked = Boolean(preflightState.thaiEsg);

      const chkConsentBox = document.getElementById('chk-ef-consent');
      if (chkConsentBox) chkConsentBox.checked = Boolean(preflightState.consentRd);

      const chkPromptBox = document.getElementById('chk-ef-promptpay');
      if (chkPromptBox) chkPromptBox.checked = Boolean(preflightState.promptPayCitizen);

      const badgePreflight = document.getElementById('badgeEfPreflightStatus');
      if (badgePreflight) {
        if (evalRes.isReady) {
          badgePreflight.textContent = isEn ? '5/5 Ready to File 🚀' : '5/5 พร้อมยื่นแบบ 🚀';
          badgePreflight.style.background = 'var(--ok-dim)';
          badgePreflight.style.color = 'var(--ok)';
          badgePreflight.style.borderColor = 'var(--ok)';
        } else if (evalRes.hasRetirementExcess) {
          badgePreflight.textContent = `${evalRes.completedCount}/5 ${isEn ? 'Blocked by Excess ⚠️' : 'ติดยอดเกินเพดาน ⚠️'}`;
          badgePreflight.style.background = 'rgba(239, 68, 68, 0.15)';
          badgePreflight.style.color = '#ef4444';
          badgePreflight.style.borderColor = '#ef4444';
        } else {
          badgePreflight.textContent = `${evalRes.completedCount}/5 ${isEn ? 'Incomplete' : 'ยังไม่พร้อม'}`;
          badgePreflight.style.background = 'var(--panel-2)';
          badgePreflight.style.color = 'var(--ink-dim)';
          badgePreflight.style.borderColor = 'var(--line)';
        }
      }
    }

    // Populate box elements
    const el401 = document.getElementById('valEf401');
    if (el401) {
      el401.textContent = formatMoney(ws.income401);
      el401.dataset.raw = ws.income401;
    }
    const el402 = document.getElementById('valEf402');
    if (el402) {
      el402.textContent = formatMoney(ws.income402);
      el402.dataset.raw = ws.income402;
    }
    const el404b = document.getElementById('valEf404b');
    if (el404b) {
      el404b.textContent = formatMoney(ws.income404b);
      el404b.dataset.raw = ws.income404b;
    }
    const elExp = document.getElementById('valEfExpense');
    if (elExp) elExp.textContent = `- ${formatMoney(ws.statutoryExpenseDeduction)}`;

    const elGrpA = document.getElementById('valEfGroupA');
    if (elGrpA) {
      elGrpA.textContent = `- ${formatMoney(ws.deductions.groupA)}`;
      elGrpA.dataset.raw = ws.deductions.groupA;
    }
    const elGrpB = document.getElementById('valEfGroupB');
    if (elGrpB) {
      elGrpB.textContent = `- ${formatMoney(ws.deductions.groupB)}`;
      elGrpB.dataset.raw = ws.deductions.groupB;
    }
    const elGrpC = document.getElementById('valEfGroupC');
    if (elGrpC) {
      elGrpC.textContent = `- ${formatMoney(ws.deductions.groupC)}`;
      elGrpC.dataset.raw = ws.deductions.groupC;
    }
    const elGrpD = document.getElementById('valEfGroupD');
    if (elGrpD) {
      elGrpD.textContent = `- ${formatMoney(ws.deductions.groupD)}`;
      elGrpD.dataset.raw = ws.deductions.groupD;
    }

    const elNetBal = document.getElementById('valEfNetBalance');
    if (elNetBal) {
      if (ws.isRefund) {
        elNetBal.textContent = `${isEn ? 'Tax Refund: ' : 'ขอคืนภาษี: '}${formatMoney(ws.netTaxDueOrRefund)} ${curUnit}`;
        elNetBal.style.color = 'var(--ok)';
        elNetBal.dataset.raw = ws.netTaxDueOrRefund;
      } else if (ws.isPayable) {
        const payable = Math.abs(ws.netTaxDueOrRefund);
        elNetBal.textContent = `${isEn ? 'Additional Tax Payable: ' : 'ภาษีชำระเพิ่ม: '}${formatMoney(payable)} ${curUnit}`;
        elNetBal.style.color = 'var(--danger)';
        elNetBal.dataset.raw = payable;
      } else {
        elNetBal.textContent = isEn ? 'Tax Balanced (0 THB)' : 'ภาษีพอดี (0 บาท)';
        elNetBal.style.color = 'var(--core)';
        elNetBal.dataset.raw = 0;
      }
    }

    const descBal = document.getElementById('descEfNetBalance');
    if (descBal) {
      if (ws.canInstallment) {
        descBal.textContent = isEn
          ? `Option to pay in 3 installments: ~${formatMoney(ws.installment3Months)} THB/month`
          : `สามารถเลือกผ่อนชำระ 3 งวดได้: งวดละ ~${formatMoney(ws.installment3Months)} บาท`;
      } else if (ws.isRefund) {
        descBal.textContent = isEn
          ? 'PromptPay direct deposit with Thai National ID ready'
          : 'พร้อมโอนเงินคืนเข้าบัญชี PromptPay ผูกเลขประจำตัวประชาชน';
      } else {
        descBal.textContent = isEn
          ? 'Reconciled with 50 Tawi withholding and dividend tax credit'
          : 'คำนวณหักภาษี ณ ที่จ่าย 50 ทวิ และเครดิตภาษีเงินปันผลแล้ว';
      }
    }
  }

  /**
   * Updates printable formal Tax Dossier & Print Report DOM elements.
   * @param {TaxWorksheetReportContext} data - Calculation report payload
   * @param {Object} [context] - Execution environment context
   */
  function updatePrintReportView(data, context = {}) {
    if (typeof document === 'undefined') return;
    const reportEl = document.getElementById('taxPrintReport');
    if (!reportEl || !data) return;

    const isEn = (context.lang || global.LANG) === 'en';
    const unit = context.unit || global.unit || (isEn ? 'THB' : 'บาท');
    const formatMoney = context.formatMoney || global.formatMoney || ((v) => String(v));
    const escapeHtml = context.escapeHtml || global.escapeHtml || ((v) => String(v));
    const incomeMode = context.incomeMode || global.incomeMode || 'monthly';

    const now = new Date();
    const yearStr = isEn
      ? `Tax Year ${now.getFullYear()}`
      : `ปีภาษี ${now.getFullYear() + 543} (พ.ศ. ${now.getFullYear() + 543})`;
    const timestampEl = document.getElementById('print-timestamp');
    if (timestampEl) {
      timestampEl.textContent = `${isEn ? 'Generated: ' : 'วันที่จัดทำ: '}${formatReportDate(now, context.lang || global.LANG)}`;
    }
    const taxYearEl = document.getElementById('print-tax-year');
    if (taxYearEl) {
      taxYearEl.textContent = yearStr;
    }

    const docTitleEl = document.getElementById('print-doc-title');
    if (docTitleEl) {
      if (incomeMode === 'yearly') {
        docTitleEl.textContent = isEn
          ? 'Annual Personal Income Tax Return Summary (Form P.N.D.90)'
          : 'รายงานสรุปภาษีเงินได้บุคคลธรรมดาประจำปี (แบบ ภ.ง.ด.90)';
      } else {
        docTitleEl.textContent = isEn
          ? 'Annual Personal Income Tax Return Summary (Form P.N.D.91)'
          : 'รายงานสรุปภาษีเงินได้บุคคลธรรมดาประจำปี (แบบ ภ.ง.ด.91)';
      }
    }

    // Income
    const mainEl = document.getElementById('print-val-income-main');
    if (mainEl) mainEl.textContent = `${formatMoney(data.salary)} ${unit}`;
    const bonusEl = document.getElementById('print-val-income-bonus');
    if (bonusEl) bonusEl.textContent = `${formatMoney(data.bonus)} ${unit}`;
    const totalIncEl = document.getElementById('print-val-income-total');
    if (totalIncEl) totalIncEl.textContent = `${formatMoney(data.totalIncome)} ${unit}`;

    // Deductions
    const expEl = document.getElementById('print-val-deduct-expense');
    if (expEl) expEl.textContent = `- ${formatMoney(data.expenseDeduction)} ${unit}`;
    const pvdEl = document.getElementById('print-val-deduct-pvd');
    if (pvdEl) pvdEl.textContent = `- ${formatMoney(data.pvdDeduction)} ${unit}`;
    const ssoEl = document.getElementById('print-val-deduct-sso');
    if (ssoEl) ssoEl.textContent = `- ${formatMoney(data.ssoDeduction)} ${unit}`;

    const updateRow = (rowId, valId, val) => {
      const row = document.getElementById(rowId);
      const valEl = document.getElementById(valId);
      if (valEl) valEl.textContent = `- ${formatMoney(val)} ${unit}`;
      if (row) row.style.display = val > 0 ? 'table-row' : 'none';
    };
    updateRow('print-row-fund', 'print-val-deduct-fund', data.effectiveFund);
    updateRow('print-row-thaiesg', 'print-val-deduct-thaiesg', data.effectiveThaiEsg);
    updateRow('print-row-ins', 'print-val-deduct-ins', data.effectiveInsurance);
    updateRow('print-row-mortgage', 'print-val-deduct-mortgage', data.effectiveMortgage);
    updateRow('print-row-easyreceipt', 'print-val-deduct-easyreceipt', data.effectiveEasyReceipt);
    updateRow('print-row-other', 'print-val-deduct-other', data.otherDeduct);

    const totalDedEl = document.getElementById('print-val-deduct-total');
    if (totalDedEl) totalDedEl.textContent = `- ${formatMoney(data.totalDeductions)} ${unit}`;

    // Progressive waterfall table
    const tbody = document.getElementById('print-tbody-waterfall');
    if (tbody) {
      if (data.netIncome <= 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="padding:6px 8px; text-align:center; color:#059669; font-weight:600;">${isEn ? '🎉 No taxable net income — 0 THB tax payable' : '🎉 ไม่มีเงินได้สุทธิที่ต้องเสียภาษี — ภาษี 0 บาท'}</td></tr>`;
      } else {
        tbody.innerHTML = (data.wf.tiers || [])
          .map((t) => {
            const label = isEn ? t.labelEn : t.labelTh;
            const rateLabel = t.rate === 0 ? (isEn ? 'Exempt (0%)' : 'ยกเว้น (0%)') : `${t.ratePct}%`;
            const taxColor = t.tax > 0 ? '#0f172a' : '#059669';
            return `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:3px 8px;">${escapeHtml(label)}</td>
                <td style="padding:3px 8px; text-align:right;">${formatMoney(t.taxable)} ${unit}</td>
                <td style="padding:3px 8px; text-align:center;">${rateLabel}</td>
                <td style="padding:3px 8px; text-align:right; font-weight:600; color:${taxColor};">${formatMoney(t.tax)} ${unit}</td>
              </tr>
            `;
          })
          .join('');
      }
    }

    // KPIs
    const netIncEl = document.getElementById('print-val-netincome');
    if (netIncEl) netIncEl.textContent = `${formatMoney(data.netIncome)} ${unit}`;
    const topRateEl = document.getElementById('print-val-toprate');
    if (topRateEl) topRateEl.textContent = `${data.wf.topMarginalRate}%`;
    const effRateEl = document.getElementById('print-val-effrate');
    if (effRateEl) effRateEl.textContent = `${data.effRate}%`;
    const totalTaxEl = document.getElementById('print-val-totaltax');
    if (totalTaxEl) totalTaxEl.textContent = `${formatMoney(data.tax)} ${unit}`;

    const withheldEl = document.getElementById('print-val-withheld');
    if (withheldEl) withheldEl.textContent = `${formatMoney(data.withheldTax || 0)} ${unit}`;
    const netBalEl = document.getElementById('print-val-netbalance');
    if (netBalEl && data.refundMetrics) {
      const rm = data.refundMetrics;
      if (rm.status === 'refund') {
        netBalEl.style.color = '#059669';
        netBalEl.textContent = isEn
          ? `Refund: + ${formatMoney(rm.amount)} ${unit}`
          : `ขอคืนภาษีได้: + ${formatMoney(rm.amount)} ${unit}`;
      } else if (rm.status === 'payable') {
        netBalEl.style.color = '#d97706';
        netBalEl.textContent = isEn
          ? `Payable: - ${formatMoney(rm.amount)} ${unit}`
          : `ชำระภาษีเพิ่ม: - ${formatMoney(rm.amount)} ${unit}`;
      } else {
        netBalEl.style.color = '#2563eb';
        netBalEl.textContent = isEn ? `Balanced (0 ${unit})` : `ภาษีพอดี (0 บาท)`;
      }
    }
  }

  const TaxWorksheet = {
    formatReportDate,
    showCopyFeedback,
    copyEFilingField,
    copyAllEFilingSummary,
    updateDividendTaxCreditUI,
    updateEFilingWorksheetView,
    updatePrintReportView,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.TaxWorksheet = TaxWorksheet;

  if (typeof global !== 'undefined') {
    if (typeof global.TaxWorksheet === 'undefined') {
      global.TaxWorksheet = TaxWorksheet;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
