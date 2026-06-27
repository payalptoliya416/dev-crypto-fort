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
    admin_id: number;

    // 2FA fields
    is_2fa_verify?: boolean;
    is_2fa_enabled?: boolean;
    requires_2fa?: boolean;

    // Login fields
    token?: string;
    token_type?: string;
    expires_in?: number;
    name?: string;
    email?: string;
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

export type Enable2FAResponse = {
  success: boolean;
  message: string;
  data: {
    secret: string;
    qr_code_url: string;
    qr_code_image: string;
  };
};

export const enable2FA = () => {
  return adminPrivateApi<Enable2FAResponse>(
    "/admin/enable-2fa",
    {
      method: "POST",
    }
  );
};

type Verify2FAPayload = {
  otp: string;
};

export const verify2FA = (body: Verify2FAPayload) => {
  return adminPrivateApi<{
    status: string;
    message: string;
  }>("/admin/verify-2fa", {
    method: "POST",
    body,
  });
};

type Login2FAPayload = {
  admin_id: number;
  otp: string;
};

export type Login2FAResponse = {
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

export const login2FA = (body: Login2FAPayload) => {
  return adminPublicApi<Login2FAResponse>("/admin/login-2fa", {
    method: "POST",
    body,
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