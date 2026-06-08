import customTokenIcon from "@/assets/custom_tokn.svg";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";

// Default token values that come with the app
const DEFAULT_TOKENS = new Set(["eth", "btc", "usdt", "usdc", "bnb", "trx", "trc20"]);

// Default token configuration
const DEFAULT_COIN_CONFIG: Record<string, { name: string; symbol: string; icon: string }> = {
  btc: { name: "Bitcoin", symbol: "BTC", icon: d2 },
  eth: { name: "Ethereum", symbol: "ETH", icon: d1 },
  usdt: { name: "Tether", symbol: "USDT", icon: d5 },
  usdc: { name: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  bnb: { name: "BNB", symbol: "BNB", icon: d3 },
  trx: { name: "TRON", symbol: "TRX", icon: d9 },
  trc20: { name: "USDT (TRC20)", symbol: "USDT", icon: d5 },
};

/**
 * Check if a token is a custom token (not in the default list)
 */
export const isCustomToken = (tokenValue: string): boolean => {
  return !DEFAULT_TOKENS.has(tokenValue?.toLowerCase());
};

/**
 * Get the correct icon for a token
 * Returns custom_tokn.svg for custom tokens, original icon for default tokens
 */
export const getTokenIcon = (
  tokenValue: string,
  fallbackIcon?: string
): string => {
  // For default tokens, use their configured icon
  if (DEFAULT_TOKENS.has(tokenValue?.toLowerCase())) {
    const config = DEFAULT_COIN_CONFIG[tokenValue?.toLowerCase()];
    return config?.icon || fallbackIcon || d1;
  }

  // For custom tokens, use the custom icon
  return customTokenIcon;
};

/**
 * Get the correct icon for display purposes
 * If the token has a custom icon provided but is a custom token, override with custom_tokn.svg
 */
export const getDisplayTokenIcon = (
  tokenValue: string,
  providedIcon?: string
): string => {
  // If it's a custom token, always use custom_tokn.svg regardless of provided icon
  if (isCustomToken(tokenValue)) {
    return customTokenIcon;
  }

  // For default tokens, use the provided icon or look up from config
  if (providedIcon && providedIcon !== customTokenIcon) {
    return providedIcon;
  }

  return getTokenIcon(tokenValue, providedIcon);
};

export { customTokenIcon, DEFAULT_COIN_CONFIG };
