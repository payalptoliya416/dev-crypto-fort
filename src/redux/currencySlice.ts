import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CurrencyState {
  value: string;
}

const initialState: CurrencyState = {
  value: localStorage.getItem("currency") || "USD",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem("currency", action.payload);
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;