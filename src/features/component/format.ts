
export const formatBalance = (
  balance: number | string | null | undefined
): string => {
  if (balance == null || isNaN(Number(balance))) {
    return "0.00";
  }

  return Number(balance).toFixed(2);
};