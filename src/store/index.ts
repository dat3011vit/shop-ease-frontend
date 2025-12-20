import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user-slice";
import authReducer from "./auth-slice";
import cartReducer from "./cart-slice";
import attributeReducer from "./attribute-slice.ts";
import addressReducer from "./address-slice.ts";
// import cartReducer from "./cart-slice";
// import orderReducer from "./order-slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";



// Persist configuration
const persistConfig = {
  key: "auth",
  storage,
  version: 1,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, authReducer);


// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  auth:persistedReducer,
  cart:cartReducer,
  attribute:attributeReducer,
  address:addressReducer
  // cart: cartReducer,
  // order: orderReducer,
});
// Store configuration with types
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Correctly type the persistor
export const persistor = persistStore(store);

// RootState type
export type RootState = ReturnType<typeof rootReducer>;

// AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
