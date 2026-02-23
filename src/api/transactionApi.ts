import { privateApi } from "./privateApi";

export interface SendTransactionPayload {
  wallet_id: number;
  to_address: string;
  amount: string;
    type: string; 
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
    gas_eth: string;
  };
}

export const getGasFee = () => {
  return privateApi<GetGasFeeResponse>("/get-gas-fee", {
    method: "GET",
  });
};