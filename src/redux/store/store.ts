import { configureStore, combineReducers } from "@reduxjs/toolkit";
import walletReducer from "../walletSlice";
import activeWalletReducer from "../activeWalletSlice";
import transactionReducer from "../transactionSlice";
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

/**
 * Root reducer
 */
const rootReducer = combineReducers({
  wallet: walletReducer,
  activeWallet: activeWalletReducer,
    transaction: transactionReducer,
});

/**
 * Persist config
 */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet", "activeWallet"], 
};

/**
 * Persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Store
 */
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
