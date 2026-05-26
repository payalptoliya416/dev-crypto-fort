
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

export const formatBalanceDecimal = (
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

  // VERY SMALL VALUES
  if (absolute < 0.000001) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 10,
    }).replace(/\.?0+$/, "");
  }

  // SMALL VALUES
  if (absolute < 1) {
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 8,
    }).replace(/\.?0+$/, "");
  }

  // NORMAL VALUES
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};