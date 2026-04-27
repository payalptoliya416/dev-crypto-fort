
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
  balance: number | string | null | undefined
): string => {
  if (balance == null || isNaN(Number(balance)) || Number(balance) === 0) {
    return "0.00";
  }

  const num = Number(balance);

  if (num < 0.000001) {
    return num.toFixed(8).replace(/\.?0+$/, ''); 
  }
  
  if (num < 1) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};