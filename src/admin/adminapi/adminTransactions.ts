import { adminPrivateApi } from "./adminPrivateApi";


export interface TransactionApi {
  id: number;
  currency: string;
  hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  transaction_type: string;
  txreceipt_status: string;
  timestamp: string;
}

export interface TransactionPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface AdminTransactionsResponse {
  success: boolean;
  data: {
    transactions: TransactionApi[];
    pagination: TransactionPagination;
  };
}

export const getAdminTransactions = (page = 1, search = "") => {
  const query = new URLSearchParams({
    per_page: "10",
    page: page.toString(),
    ...(search ? { search } : {}),
  }).toString();

  return adminPrivateApi<AdminTransactionsResponse>(
    `/admin/transactions?${query}`
  );
};

export interface CustomTokenApi {
  id: number;
  network: string;
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  is_eth: boolean;
  total_wallets: number;
  token_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CustomTokenPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CustomTokensResponse {
  success: boolean;
  data: {
    tokens: CustomTokenApi[];
    pagination: CustomTokenPagination;
  };
}
export const getCustomTokens = (page = 1, search = "") => {
  return adminPrivateApi<CustomTokensResponse>(
    "/admin/custom-tokens",
    {
      method: "POST",
      body: {
        page,
        per_page: 10,
        search,
      },
    }
  );
};
export interface ImportCustomTokenPayload {
  contract_address: string;
  is_eth: boolean;
  token_image: string;
}

export interface ImportCustomTokenResponse {
  success: boolean;
  message: string;
}
export const importCustomToken = (
  data: ImportCustomTokenPayload
) => {
  return adminPrivateApi<ImportCustomTokenResponse>(
    "/admin/custom-tokens/import",
    {
      method: "POST",
      body: data,
    }
  );
};

export interface CustomTokenUser {
  balance_id: number;
  wallet_id: number;
  eth_address: string;
  user_id: number;
  user_name: string | null;
  user_email: string | null;
  balance: string;
  updated_at: string;
}

export interface CustomTokenDetailsResponse {
  success: boolean;
  data: {
    token: {
      id: number;
      network: string;
      contract_address: string;
      name: string;
      symbol: string;
      decimals: number;
      is_eth: boolean;
      token_image_url: string;
      created_at: string;
    };
    users: CustomTokenUser[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export const getCustomTokenDetails = (
  id: number | string,
  page = 1,
  search = ""
) => {
  return adminPrivateApi<CustomTokenDetailsResponse>(
    `/admin/custom-tokens/${id}`,
    {
      method: "POST",
      body: {
        page,
        per_page: 10,
        search,
      },
    }
  );
};