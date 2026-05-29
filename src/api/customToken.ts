import { privateApi } from "./privateApi";

export interface ImportTokenPayload {
  wallet_id: number;
  contract_address: string;
}

export interface ImportTokenResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    wallet_id: number;
    network: string;
    contract_address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
  };
}

export const importToken = (payload: ImportTokenPayload) => {
  return privateApi<ImportTokenResponse>("/custom-tokens/import", {
    method: "POST",
    body: payload,
  });
};