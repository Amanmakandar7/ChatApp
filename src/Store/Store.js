// src/Store/store.js (or wherever your store is configured)
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../Slice/authSlice";
import otpReducer from "../Slice/otpSlice"; 


export const store = configureStore({
  reducer: {
    chat: chatReducer,
    otp: otpReducer,
    
  },
});
