import { privateApi } from "./privateApi";

export interface Wallet {
  id: number;
  address: string;
  label: string | null;
  status: string;
  created_at: string;
  balance: string;
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
export interface DownloadBackupPayload {
  wallet_id: number;
}

export interface DownloadBackupResponse {
  success: boolean;
  message: string;
  data?: {
    wallet_id: number;
    address: string;
    file_path: string;
  };
}

export const downloadWalletBackup = (payload: DownloadBackupPayload) => {
  return privateApi<DownloadBackupResponse>("/wallets/download-backup", {
    method: "POST",
    body: payload,
  });
};

export interface ExportTransactionsPayload {
  wallet_id: number;
  type: "excel" | "pdf";
}

export interface ExportTransactionsResponse {
  success: boolean;
  message: string;
  data?: {
    file_url: string;
    file_name: string;
  };
}

export const exportTransactions = (
  payload: ExportTransactionsPayload,
) => {
  return privateApi<ExportTransactionsResponse>(
    "/transactions/export",
    {
      method: "POST",
      body: payload,
    }
  );
};


export interface Transaction {
  id: number;
  wallet_id: number;
  hash: string;
  from_address: string;
  to_address: string;
  amount: string;
  gas_price: string;
  gas_used: string;
  block_number: number;
  nonce: string;
  transaction_type: "Send" | "Receive";
  txreceipt_status: "Success" | "Failed";
  timestamp: string;
}

export interface GetTransactionsPayload {
  wallet_id: number;
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

export const getTransactions = (
  payload: GetTransactionsPayload,
) => {
  return privateApi<GetTransactionsResponse>(
    "/get-transactions",
    {
      method: "POST",
      body: payload,
    }
  );
};

// -------------------
