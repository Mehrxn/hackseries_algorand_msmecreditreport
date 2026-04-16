/**
 * Credit score calculation based on financial metrics
 * Score range: 0-100
 * Weights:
 * - Income Consistency: 30%
 * - Expense Ratio: 25%
 * - Transaction Frequency: 20%
 * - GST Compliance: 15%
 * - Cash Buffer: 10%
 */

export interface FinancialData {
  monthlyIncome: number[];
  monthlyExpenses: number[];
  transactionCount: number;
  gstFiledMonths: number;
  gstTotalMonths: number;
  cashBalance: number;
  avgMonthlyIncome: number;
}

export interface ScoringResult {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  breakdown: {
    incomeConsistency: number;
    expenseRatio: number;
    transactionFrequency: number;
    gstCompliance: number;
    cashBuffer: number;
  };
}

/**
 * Calculate income consistency score (0-100)
 * Based on coefficient of variation of monthly income
 * Lower variation = higher consistency
 */
function calculateIncomeConsistency(monthlyIncome: number[]): number {
  if (monthlyIncome.length < 2) return 0;

  const mean = monthlyIncome.reduce((a, b) => a + b, 0) / monthlyIncome.length;
  if (mean === 0) return 0;

  const variance = monthlyIncome.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyIncome.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;

  // Convert CV to score: 0% CV = 100, 100% CV = 0
  return Math.max(0, Math.min(100, 100 - coefficientOfVariation * 100));
}

/**
 * Calculate expense ratio score (0-100)
 * Ideal: 60% expense ratio
 * Score decreases as ratio deviates from ideal
 */
function calculateExpenseRatio(monthlyIncome: number[], monthlyExpenses: number[]): number {
  if (monthlyIncome.length === 0) return 0;

  const totalIncome = monthlyIncome.reduce((a, b) => a + b, 0);
  const totalExpenses = monthlyExpenses.reduce((a, b) => a + b, 0);

  if (totalIncome === 0) return 0;

  const expenseRatio = totalExpenses / totalIncome;
  const idealRatio = 0.6;

  // Penalize both overspending and underspending
  const deviation = Math.abs(expenseRatio - idealRatio);
  return Math.max(0, Math.min(100, 100 - deviation * 100));
}

/**
 * Calculate transaction frequency score (0-100)
 * More transactions = higher frequency score
 * Expects at least 1 transaction per month
 */
function calculateTransactionFrequency(transactionCount: number, monthsOfData: number): number {
  if (monthsOfData === 0) return 0;

  const avgTransactionsPerMonth = transactionCount / monthsOfData;
  
  // Score based on transactions/month: 0 txns = 0, 30+ txns/month = 100
  // Linear scale: 1 txn/month = 3.33 points
  return Math.min(100, (avgTransactionsPerMonth / 30) * 100);
}

/**
 * Calculate GST compliance score (0-100)
 * Based on ratio of GST filed months to total months
 */
function calculateGSTCompliance(gstFiledMonths: number, gstTotalMonths: number): number {
  if (gstTotalMonths === 0) return 0;

  const complianceRatio = gstFiledMonths / gstTotalMonths;
  return Math.min(100, complianceRatio * 100);
}

/**
 * Calculate cash buffer score (0-100)
 * Ideal cash buffer = 2 months of expenses
 * Score based on months of buffer
 */
function calculateCashBuffer(cashBalance: number, monthlyExpenses: number[]): number {
  if (monthlyExpenses.length === 0) return 0;

  const avgMonthlyExpense = monthlyExpenses.reduce((a, b) => a + b, 0) / monthlyExpenses.length;
  
  if (avgMonthlyExpense === 0) return 0;

  const monthsOfBuffer = cashBalance / avgMonthlyExpense;
  const idealMonths = 2;

  // Score: 0 months = 0, at least 2 months = 100
  return Math.min(100, (monthsOfBuffer / idealMonths) * 100);
}

/**
 * Calculate overall credit score and risk level
 */
export function calculateCreditScore(data: FinancialData): ScoringResult {
  const incomeConsistency = calculateIncomeConsistency(data.monthlyIncome);
  const expenseRatio = calculateExpenseRatio(data.monthlyIncome, data.monthlyExpenses);
  const transactionFrequency = calculateTransactionFrequency(
    data.transactionCount,
    data.monthlyIncome.length
  );
  const gstCompliance = calculateGSTCompliance(data.gstFiledMonths, data.gstTotalMonths);
  const cashBuffer = calculateCashBuffer(data.cashBalance, data.monthlyExpenses);

  // Weighted score
  const weightedScore =
    incomeConsistency * 0.3 +
    expenseRatio * 0.25 +
    transactionFrequency * 0.2 +
    gstCompliance * 0.15 +
    cashBuffer * 0.1;

  const score = Math.round(weightedScore);

  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  if (score >= 75) {
    riskLevel = 'LOW';
  } else if (score >= 45) {
    riskLevel = 'MEDIUM';
  } else {
    riskLevel = 'HIGH';
  }

  return {
    score,
    riskLevel,
    breakdown: {
      incomeConsistency: Math.round(incomeConsistency),
      expenseRatio: Math.round(expenseRatio),
      transactionFrequency: Math.round(transactionFrequency),
      gstCompliance: Math.round(gstCompliance),
      cashBuffer: Math.round(cashBuffer),
    },
  };
}
