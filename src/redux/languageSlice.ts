import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("app_language") || "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
      localStorage.setItem("app_language", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;