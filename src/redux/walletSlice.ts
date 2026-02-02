import { createSlice } from "@reduxjs/toolkit";

type WalletData = {
  wallet_id: number;
  address: string;
  phrase: string;
};

type WalletState = {
  wallet: WalletData | null;
};

const initialState: WalletState = {
  wallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet(state, action) {
      state.wallet = action.payload;
    },
    clearWallet(state) {
      state.wallet = null;
    },
  },
});

export const { setWallet, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;
