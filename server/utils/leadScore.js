export const getLeadScore = (budget = 0, interestLevel = 1) => {
  const numericBudget = Number(budget) || 0;
  const numericInterest = Number(interestLevel) || 1;

  const budgetScore = numericBudget >= 100000 ? 45 : numericBudget >= 50000 ? 30 : numericBudget >= 20000 ? 18 : 8;
  const interestScore = Math.min(Math.max(numericInterest, 1), 10) * 5;
  const total = Math.min(100, budgetScore + interestScore);

  if (total >= 75) return { score: total, label: 'Hot' };
  if (total >= 45) return { score: total, label: 'Warm' };
  return { score: total, label: 'Cold' };
};
