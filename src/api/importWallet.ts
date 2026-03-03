import { publicApi } from "./publicApi";
import { privateApi } from "./privateApi";

type ImportPayload = {
  type: "phrase" | "key";
  data: string;
};

type ImportResponse = {
  success: boolean;
  message: string;
  data: {
    wallet_id: number;
    address: string;
    phrase?: string;
    token?: string;
    expires_in?: number;
  };
};

export const importWallet = (
  body: ImportPayload,
  useToken: boolean = false
) => {
  if (useToken) {
    return privateApi<ImportResponse>("/recover-wallet", {
      method: "POST",
      body,
    });
  }

  return publicApi<ImportResponse>("/recover-wallet", {
    method: "POST",
    body,
  });
};
