import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../walletSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// ✅ Persist Config
const persistConfig = {
  key: "root",
  storage,
};

// ✅ Persisted Reducer
const persistedReducer = persistReducer(persistConfig, walletReducer);

export const store = configureStore({
  reducer: {
    wallet: persistedReducer,
  },
});

// ✅ Persistor Export
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
