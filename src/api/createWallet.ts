import { publicApi } from "./publicApi";

type WalletResponse = {
  success: boolean;
  message: string;
  data: {
    wallet_id: number;
    address: string;
    phrase: string; 
  };
};

export const createWallet = () => {
  return publicApi<WalletResponse>("/create-wallet", {
    method: "GET",
  });
};
