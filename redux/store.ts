// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./slices/leadSlice";

export const store = configureStore({
  reducer: {
    leads: leadReducer,
  },
});

// Infer the `RootState` and `AppDispatch` from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
