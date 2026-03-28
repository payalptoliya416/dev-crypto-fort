import { adminPrivateApi } from "./adminPrivateApi";

export interface MainAccount {
  id: number;
  label: string | null;
  eth_address: string;
  btc_address: string;
  eth_balance: number;
  btc_balance: number;
  usdt_balance: number;
  is2FAEnabled: boolean;
}

export interface OtherAccount {
  id: number;
  label: string | null;
  eth_address: string;
  btc_address: string;
  eth_balance: number;
  btc_balance: number;
  usdt_balance: number;
}

export interface AdminUser {
  id: number;
  created_at: string;
  main_account: MainAccount;
  other_accounts: OtherAccount[];
  is_2fa_enabled?: boolean;
}

export interface UsersPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    pagination: UsersPagination;
  };
}

export const getAdminUsers = (page = 1, search = "") => {
  const query = new URLSearchParams({
    per_page: "10",
    page: page.toString(),
    search: search,
  }).toString();

  return adminPrivateApi<AdminUsersResponse>(`/admin/users?${query}`, {
    method: "GET",
  });
};

interface Reset2FAResponse {
  success: boolean;
  message: string;
}

export const resetUser2FA = (user_id: number) => {
  return adminPrivateApi<Reset2FAResponse>(`/admin/users/reset-2fa`, {
    method: "POST",
    body: {
      user_id: user_id,
    },
  });
};
