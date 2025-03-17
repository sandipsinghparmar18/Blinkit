import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import productSlice from "./productSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productSlice,
  },
});
