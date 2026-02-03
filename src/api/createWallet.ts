import { publicApi } from "./publicApi";
import { privateApi } from "./privateApi";

type WalletResponse = {
  success: boolean;
  message: string;
  data: {
    wallet_id: number;
    address: string;
    phrase: string;
  };
};

export const createWallet = (useToken: boolean = false) => {
  if (useToken) {
    return privateApi<WalletResponse>("/create-wallet", {
      method: "GET",
    });
  }

  return publicApi<WalletResponse>("/create-wallet", {
    method: "GET",
  });
};
