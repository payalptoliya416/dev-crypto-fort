import { adminPublicApi } from "./adminPublicApi";
import { adminPrivateApi } from "./adminPrivateApi";

type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    admin_id: number;
    name: string;
    email: string;
  };
};

export const adminLogin = (body: AdminLoginPayload) => {
  return adminPublicApi<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body,
  });
};

export const adminLogout = () => {
  return adminPrivateApi("/admin/logout", {
    method: "POST",
  });
};

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const changeAdminPassword = (body: ChangePasswordPayload) => {
  return adminPrivateApi<ChangePasswordResponse>(
    "/admin/change-password",
    {
      method: "POST",
      body,
    }
  );
};