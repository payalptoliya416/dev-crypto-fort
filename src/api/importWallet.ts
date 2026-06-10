import { publicApi } from "./publicApi";
import { privateApi } from "./privateApi";

type ImportPayload = {
  type: "phrase" | "key";
  data: string;
};

type ImportResponse = {
  success: boolean;
  message: string;
  data: {
    wallet_id: number;
    eth_address: string;
    phrase?: string;
    token?: string;
    expires_in?: number;
  };
};

export const importWallet = (
  body: ImportPayload,
  useToken: boolean = false
) => {
  if (useToken) {
    return privateApi<ImportResponse>("/recover-wallet", {
      method: "POST",
      body,
    });
  }

  return publicApi<ImportResponse>("/recover-wallet", {
    method: "POST",
    body,
  });
};

// Types
export interface BalanceHistoryPayload {
  user_id: number | string;
  wallet_id: number | string;
}

export interface BalanceHistoryItem {
  balance: string;
  recorded_at: string;
}

export interface BalanceHistoryResponse {
  success: boolean;
  user_id: number;
  wallet_id: number;
  data: {
    [symbol: string]: BalanceHistoryItem[];
  };
}

// API
export const getBalanceHistory = (
  payload: BalanceHistoryPayload
) => {
  return privateApi<BalanceHistoryResponse>(
    "/balances/history",
    {
      method: "POST",
      body: payload,
    }
  );
};