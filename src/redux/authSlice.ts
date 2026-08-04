import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const TOKEN_KEY = "token";
const EXPIRY_KEY = "token_expiry";
const USER_ID_KEY = "user_id";

type AuthState = {
  token: string | null;
  userId?: number | null;
  unlocked: boolean;
};

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

const getUserId = () => {
  const userId = localStorage.getItem(USER_ID_KEY);
  return userId ? Number(userId) : null;
};

const initialState: AuthState = {
  token: getValidToken(),
  userId: getUserId(),
  unlocked: sessionStorage.getItem("wallet_unlocked") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        token: string | null;
        expiresIn: number;
        userId?: number;
      }>,
    ) => {
      const { token, expiresIn, userId } = action.payload;

      const expirySeconds =
        typeof expiresIn === "number" ? expiresIn : 24 * 60 * 60;

      const expiryTime = Date.now() + expirySeconds * 1000;

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRY_KEY);
      }

      if (typeof userId === "number") {
        localStorage.setItem(USER_ID_KEY, userId.toString());
      } else {
        localStorage.removeItem(USER_ID_KEY);
      }

      state.token = token;
      state.userId = userId ?? null;
    },

    logout: (state) => {
      // clear session unlock marker as well
      try {
        sessionStorage.removeItem("wallet_unlocked");
      } catch (e) {
        // ignore
      }

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      localStorage.removeItem(USER_ID_KEY);

      state.token = null;
      state.userId = null;
      state.unlocked = false;

      localStorage.clear();
    },
    unlockWallet: (state) => {
      state.unlocked = true;
      try {
        sessionStorage.setItem("wallet_unlocked", "true");
      } catch (e) {
        // ignore if sessionStorage unavailable
      }
    },

    lockWallet: (state) => {
      state.unlocked = false;
      try {
        sessionStorage.removeItem("wallet_unlocked");
      } catch (e) {
        // ignore
      }
    },
  },
});

export const { setToken, logout, unlockWallet, lockWallet } = authSlice.actions;
export default authSlice.reducer;
