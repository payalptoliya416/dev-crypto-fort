
// export const formatBalance = (
//   balance: number | string | null | undefined
// ): string => {
//   if (balance == null || isNaN(Number(balance))) {
//     return "0.00";
//   }

//   const num = Number(balance);
  
//   if (num < 0.01 && num > 0) {
//     return num.toFixed(8).replace(/\.?0+$/, '');
//   }
  
//   return num.toFixed(2);
// };

export const formatBalance = (
  balance: number | string | null | undefined,
  options?: { isFiat?: boolean }
): string => {
  if (balance == null || isNaN(Number(balance))) {
    return "0.00";
  }

  const num = Number(balance);

  if (options?.isFiat) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (num === 0) {
    return "0.00";
  }

  const absolute = Math.abs(num);

  if (absolute < 0.000001) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  if (absolute < 1) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};