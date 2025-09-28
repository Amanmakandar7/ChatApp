// src/Slice/otpSlice.js
import { createSlice } from "@reduxjs/toolkit";

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    value: null,
    sent: false,
  },
  reducers: {
    generateOtp: (state) => {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      state.value = newOtp;
      state.sent = true;
    },
    clearOtp: (state) => {
      state.value = null;
      state.sent = false;
    },
  },
});

export const { generateOtp, clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
