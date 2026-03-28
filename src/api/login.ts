import { privateApi } from "./privateApi";
import { publicApi } from "./publicApi";

type LoginPayload = {
  seed_phrase: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data:
    | {
        //  Direct login case
        token: string | null; 
        token_type: string;
        expires_in: number;
        user_id: number;
      }
    | {
        //  2FA required case
        user_id: number;
        requires_2fa: boolean;
        is_2fa_enabled: boolean;
      };
};

export const loginUser = (body: LoginPayload) => {
  return publicApi<LoginResponse>("/login", {
    method: "POST",
    body,
  });
};

type Enable2FAResponse = {
  success: boolean;
  message: string;
  data: {
    secret: string;
    qr_code_url: string;
    qr_code_image: string;
  };
};

export const enable2FA = () => {
  return privateApi<Enable2FAResponse>("/enable-2fa", {
    method: "POST",
  });
};

type Verify2FAPayload = {
  otp: string;
};

type Verify2FAResponse = {
  success?: boolean;
  status?: string;
  message: string;
};

export const verify2FA = (body: Verify2FAPayload) => {
  return privateApi<Verify2FAResponse>("/verify-2fa", {
    method: "POST",
    body,
  });
};


type LoginVerify2FAPayload = {
  otp: string;
  user_id : number;
};

type LoginVerify2FAResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    user_id: number;
  };
};

export const loginVerify2FA = (body: LoginVerify2FAPayload) => {
  return privateApi<LoginVerify2FAResponse>("/login-2fa", {
    method: "POST",
    body,
  });
};

type Disable2FAPayload = {
  user_id: number;
};

type Disable2FAResponse = {
  success: boolean;
  message: string;
};

export const disable2FA = (body: Disable2FAPayload) => {
  return privateApi<Disable2FAResponse>("/disable-2fa", {
    method: "POST",
    body,
  });
};
