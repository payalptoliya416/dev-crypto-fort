import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "token";
const EXPIRY_KEY = "token_expiry";

const getValidToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!token || !expiry) return null;

  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }

  return token;
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: getValidToken(),
  },
  reducers: {
    setToken: (state, action) => {
      const { token, expiresIn } = action.payload;

      const expiryTime = Date.now() + expiresIn * 1000;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(EXPIRY_KEY, expiryTime.toString());

      state.token = token;
    },
    logout: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      state.token = null;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;