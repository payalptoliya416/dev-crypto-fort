import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  toAddress: string;
  amount: string;
  gasFee: string;
  totalCost: string;
}

const initialState: TransactionState = {
  toAddress: "",
  amount: "",
  gasFee: "",
  totalCost: "",
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionData(
      _,
      action: PayloadAction<TransactionState>
    ) {
      return action.payload;
    },
    resetTransaction() {
      return initialState;
    },
  },
});

export const {
  setTransactionData,
  resetTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
