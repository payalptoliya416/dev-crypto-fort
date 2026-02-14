import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Wallet } from "../api/walletApi";

interface ActiveWalletState {
  wallet: Wallet | null;
}

const initialState: ActiveWalletState = {
  wallet: null,
};

const activeWalletSlice = createSlice({
  name: "activeWallet",
  initialState,
  reducers: {
    setActiveWallet(state, action: PayloadAction<Wallet>) {
      state.wallet = action.payload;
    },
    resetActiveWallet(state) {
      state.wallet = null;
    },
  },
});

export const { setActiveWallet, resetActiveWallet } =
  activeWalletSlice.actions;

export default activeWalletSlice.reducer;
