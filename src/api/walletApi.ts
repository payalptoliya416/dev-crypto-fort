import { privateApi } from "./privateApi";

export interface Wallet {
  id: number;
  address: string;
  label: string | null;
  status: string;
  created_at: string;
  balance: string;
eth_balance?: string;
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
  format: "excel" | "pdf";
  type: "all" | "eth" | "btc" | "usdt";
}

export interface ExportTransactionsResponse {
  success: boolean;
  message: string;
  data?: {
    wallet: {
      id: number;
      address: string;
      btc_address?: string;
    };
    transactions: {
      currency: string;
      hash: string;
      from_address: string;
      to_address: string;
      amount: string;
      gas_price: string;
      gas_used: string;
      transaction_type: string;
      timestamp: string;
      created_at: string;
    }[];
  };
}

export const exportTransactions = (payload: ExportTransactionsPayload) => {
  return privateApi<ExportTransactionsResponse>("/transactions/export", {
    method: "POST",
    body: payload,
  });
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
  currency? : string;
  block_number: number;
  nonce: string;
  transaction_type: "Send" | "Receive";
  txreceipt_status: "Success" | "Failed" | "Pending";
  timestamp: string;
}

export interface GetTransactionsPayload {
  wallet_id: number;
   type: "all" | "eth" | "btc" | "usdt";
}

export interface GetTransactionsResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

export const getTransactions = (payload: GetTransactionsPayload) => {
  return privateApi<GetTransactionsResponse>("/get-transactions", {
    method: "POST",
    body: payload,
  });
};

// -------------------

export interface CoinPriceResponse {
  [coin: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

// export const getLivePrices = async () => {
//   const res = await fetch(
//     "https://api.coingecko.com/api/v3/simple/price" +
//       "?ids=ethereum,bitcoin,binancecoin,solana,tether,arbitrum,xrp,dogecoin" +
//       "&vs_currencies=usd" +
//       "&include_24hr_change=true",
//   );

//   return (await res.json()) as CoinPriceResponse;
// };
// =-=============================================

export const getLivePrices = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets" +
      "?vs_currency=usd" +
      "&ids=ethereum,bitcoin,tether" +
      "&price_change_percentage=1h"
  );

  return await res.json();
};
export interface UpdateWalletLabelPayload {
  id: number;
  label: string;
}

export interface UpdateWalletLabelResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    address: string;
    label: string;
  };
}

export const updateWalletLabel = (payload: UpdateWalletLabelPayload) => {
  return privateApi<UpdateWalletLabelResponse>("/wallets/label-update", {
    method: "POST",
    body: payload,
  });
};

export interface GetBalancePayload {
  wallet_id: number;
  type: "all";
}


export interface CoinBalance {
  eth: string;
  btc: string;
  usdt: string;
}

export interface GetBalanceResponse {
  success: boolean;
  message: string;
  data: {
    wallet_id: number;
    address: string;
    btc_address: string;
    type: string;
    balance: CoinBalance;
  };
}

export const getBalance = (payload: GetBalancePayload) => {
  return privateApi<GetBalanceResponse>("/get-balance", {
    method: "POST",
    body: payload,
  });
};
