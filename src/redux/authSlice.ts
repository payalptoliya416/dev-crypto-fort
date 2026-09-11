import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../utils/tokenStorage";

const EXPIRY_KEY = "token_expiry";
const USER_ID_KEY = "user_id";

type AuthState = {
  token: string | null;
  userId?: number | null;
  unlocked: boolean;
};

const getValidToken = () => {
  return getStoredToken();
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
        expiresIn?: number | null;
        userId?: number;
      }>,
    ) => {
      const { token, userId } = action.payload;

      if (token) {
        setStoredToken(token);
      } else {
        removeStoredToken();
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

      state.token = null;
      state.userId = null;
      state.unlocked = false;
    },

    restoreToken: (state) => {
      state.token = getValidToken();
      state.userId = getUserId();
    },

    clearToken: (state) => {
      removeStoredToken();
      localStorage.removeItem(EXPIRY_KEY);
      localStorage.removeItem(USER_ID_KEY);
      state.token = null;
      state.userId = null;
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

export const {
  setToken,
  logout,
  restoreToken,
  clearToken,
  unlockWallet,
  lockWallet,
} = authSlice.actions;
export default authSlice.reducer;
