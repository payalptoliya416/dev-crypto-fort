import { privateApi } from "./privateApi";

export interface SendTransactionPayload {
  wallet_id: number;
  to_address: string;
  amount: string;
  type: string; 
  is_full? : boolean;
}

export const sendTransaction = (payload: SendTransactionPayload) => {
  return privateApi<{
    success: boolean;
    message: string;
    data?: {
      success: boolean;
      hash: string;
    };
  }>("/send-transaction", {
    method: "POST",
    body: payload,
  });
};

export interface GetGasFeeResponse {
  success: boolean;
  message: string;
  data?: {
    gas_fee_eth?: string;
    gas_fee_gwei?: string;
    gas_eth?: string;
    gas_gwei?: string;
  };
}

export const getGasFee = (params?: { token?: string; amount?: string }) => {
  const query = new URLSearchParams();
  if (params?.token) query.set("token", params.token);
  if (params?.amount) query.set("amount", params.amount);

  const url = query.toString() ? `/get-gas-fee?${query.toString()}` : "/get-gas-fee";
  return privateApi<GetGasFeeResponse>(url, {
    method: "GET",
  });
};

export interface SwapPayload {
  wallet_id: number;
  from_currency: string;
  to_currency: string;
  amount: number;
}

export const swapToken = (payload: SwapPayload) => {
  return privateApi<{
    success: boolean;
    message?: string;
    errors?: {
      amount?: string[];
    };
    hash?: string;
    data?: {
      success: boolean;
      hash: string;
      message: string;
    };
  }>("/swap", {
    method: "POST",
    body: payload,
  });
};