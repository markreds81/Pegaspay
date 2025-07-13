// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { pegaspayAPI } from "@/api/pegaspayAPI";

export const store = configureStore({
    reducer: {
        [pegaspayAPI.reducerPath]: pegaspayAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pegaspayAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
