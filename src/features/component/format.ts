
export const formatBalance = (
  balance: number | string | null | undefined
): string => {
  if (balance == null || isNaN(Number(balance))) {
    return "0.00";
  }

  const num = Number(balance);
  
  if (num < 0.01 && num > 0) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }
  
  return num.toFixed(2);
};