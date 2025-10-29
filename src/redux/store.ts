import { configureStore, Store } from "@reduxjs/toolkit";
import bookSlice from "./features/bookSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'bookSlice',
    storage,
}

const persistedReducer = persistReducer(persistConfig, bookSlice)

export const store = configureStore({
    reducer: {
        bookSlice: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch