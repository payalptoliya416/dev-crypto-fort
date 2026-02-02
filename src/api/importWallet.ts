import { publicApi } from "./publicApi";

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
  };
};

export const importWallet = (body: ImportPayload) => {
  return publicApi<ImportResponse>("/recover-wallet", {
    method: "POST",
    body,
  });
};
