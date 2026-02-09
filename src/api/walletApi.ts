import { privateApi } from "./privateApi";

export interface Wallet {
  id: number;
  address: string;
  label: string | null;
  status: string;
  created_at: string;
}

export interface WalletListResponse {
  success: boolean;
  message: string;
  data: Wallet[];
}

export const getWallets = () => {
  return privateApi<WalletListResponse>("/wallets", {
    method: "GET",
  });
};
