import { configureStore, combineReducers } from "@reduxjs/toolkit";
import walletReducer from "../walletSlice";
import activeWalletReducer from "../activeWalletSlice";
import transactionReducer from "../transactionSlice";
import currencyReducer from "../currencySlice";
import authReducer from "../authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
    auth: authReducer, 
  wallet: walletReducer,
  activeWallet: activeWalletReducer,
  transaction: transactionReducer,
  currency: currencyReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "wallet", "activeWallet"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
