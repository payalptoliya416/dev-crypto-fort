import { publicApi } from "./publicApi";
import { privateApi } from "./privateApi";

type SetPasswordPayload = {
  wallet_id: number;
  address: string;
  password: string;
  password_confirmation: string;
  acknowledge_password_loss?: boolean;
};

type SetPasswordResponse = {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    wallet_id: number;
  };
};

export const setWalletPassword = (
  body: SetPasswordPayload,
  useToken: boolean = false
) => {
  if (useToken) {
    return privateApi<SetPasswordResponse>("/set-wallet-password", {
      method: "POST",
      body,
    });
  }
  return publicApi<SetPasswordResponse>("/set-wallet-password", {
    method: "POST",
    body,
  });
};
