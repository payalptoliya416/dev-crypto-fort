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