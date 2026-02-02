import { publicApi } from "./publicApi";

type SetPasswordPayload = {
  wallet_id: number;
  address: string;
  password: string;
  password_confirmation: string;
};

type SetPasswordResponse = {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    wallet_id: number;
  };
};

export const setWalletPassword = (body: SetPasswordPayload) => {
  return publicApi<SetPasswordResponse>("/set-wallet-password", {
    method: "POST",
    body,
  });
};
