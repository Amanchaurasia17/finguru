
function calculateOldRegimeTax(income, deductions) {
  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + (val || 0), 0);
  const taxableIncome = Math.max(0, income - totalDeductions);
  return getTaxForSlabs(taxableIncome, "old");
}

function calculateNewRegimeTax(income) {
  return getTaxForSlabs(income, "new");
}

function getTaxForSlabs(income, regime) {
  let tax = 0;

  if (regime === "old") {
    if (income <= 250000) tax = 0;
    else if (income <= 500000) tax = (income - 250000) * 0.05;
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.2;
    else tax = 112500 + (income - 1000000) * 0.3;
  }

  if (regime === "new") {
    const slabs = [
      [250000, 0],
      [500000, 0.05],
      [750000, 0.10],
      [1000000, 0.15],
      [1250000, 0.20],
      [1500000, 0.25],
      [Infinity, 0.30],
    ];

    let remaining = income, prev = 0;
    for (const [limit, rate] of slabs) {
      if (remaining <= 0) break;
      const taxable = Math.min(limit - prev, remaining);
      tax += taxable * rate;
      remaining -= taxable;
      prev = limit;
    }
  }

  return Math.round(tax);
}

function getOptimizedTax(userTaxData) {
  const safeNumber = (val) => Math.max(0, Number(val) || 0);

  const {
    salaryIncome = 0,
    businessIncome = 0,
    otherIncome = 0,
    investment80C = 0,
    healthInsurance80D = 0,
    educationLoan80E = 0,
    homeLoanInterest = 0,
    rentPaid = 0,
  } = userTaxData;

  const annualIncome =
    safeNumber(salaryIncome) +
    safeNumber(businessIncome) +
    safeNumber(otherIncome);

  // Regime-specific standard deductions
  const STANDARD_DEDUCTION_OLD = salaryIncome > 0 ? 50000 : 0;
  const STANDARD_DEDUCTION_NEW = salaryIncome > 0 ? 75000 : 0;

  const deductionLimits = {
    investment80C: 150000,
    healthInsurance80D: 50000,
    educationLoan80E: Infinity,
    homeLoanInterest: 200000,
    rentPaid: 60000,
  };

  // Cap deductions for old regime
  const cappedDeductionsOld = {
    investment80C: Math.min(safeNumber(investment80C), deductionLimits.investment80C),
    healthInsurance80D: Math.min(safeNumber(healthInsurance80D), deductionLimits.healthInsurance80D),
    educationLoan80E: safeNumber(educationLoan80E),
    homeLoanInterest: Math.min(safeNumber(homeLoanInterest), deductionLimits.homeLoanInterest),
    rentPaid: Math.min(safeNumber(rentPaid), deductionLimits.rentPaid),
    standardDeductionOld: STANDARD_DEDUCTION_OLD,
  };

  const oldTax = calculateOldRegimeTax(annualIncome, cappedDeductionsOld);
  const newTax = calculateNewRegimeTax(annualIncome - STANDARD_DEDUCTION_NEW);

  const totalDeductionsOld = Object.values(cappedDeductionsOld).reduce((sum, val) => sum + val, 0);
  const taxableIncomeOld = annualIncome - totalDeductionsOld;
  const taxableIncomeNew = annualIncome - STANDARD_DEDUCTION_NEW;

  let finalOldTax = oldTax;
  let finalNewTax = newTax;

  // Apply rebate under 87A
  if (taxableIncomeOld <= 500000) finalOldTax = 0;
  if (taxableIncomeNew <= 500000) finalNewTax = 0;

  const betterRegime =
    finalOldTax === finalNewTax
      ? "either"
      : finalOldTax < finalNewTax
      ? "old"
      : "new";

  let suggestions = [];

  if (Math.min(finalOldTax, finalNewTax) > 0) {
    suggestions = Object.entries(deductionLimits)
      .filter(([key, limit]) => {
        const userVal = safeNumber(userTaxData[key]);
        return userVal < limit && limit !== Infinity && limit - userVal > 0;
      })
      .map(([key, limit]) => {
        const remaining = limit - safeNumber(userTaxData[key]);
        return `You can invest ₹${remaining.toLocaleString()} more under ${key.toUpperCase()} to reduce your tax.`;
      });
  }

  return {
    oldRegimeTax: finalOldTax,
    newRegimeTax: finalNewTax,
    recommended: betterRegime,
    annualIncome,
    deductions: {
      ...cappedDeductionsOld,
      standardDeductionNew: STANDARD_DEDUCTION_NEW,
    },
    suggestions,
  };
}

module.exports = { getOptimizedTax };
