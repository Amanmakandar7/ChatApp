// src/Store/store.js (or wherever your store is configured)
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../Slice/authSlice";


export const store = configureStore({
  reducer: {
    chat: chatReducer,
    
  },
});
