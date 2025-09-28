import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { generateOtp, clearOtp } from "../Slice/otpSlice"; // adjust path

// Validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  otp: z.string().length(4, "OTP must be 4 digits").optional(),
});

export default function Login({ onLoginSuccess }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [otpError, setOtpError] = useState(null);

  const dispatch = useDispatch();
  const otpValueFromRedux = useSelector((state) => state.otp.value);
  const otpSentFromRedux = useSelector((state) => state.otp.sent);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const phoneValue = watch("phone");
  const otpValue = watch("otp");

  // Fetch country data
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((res) => res.json())
      .then((data) => {
        const countryData = data
          .filter((c) => c.idd?.root)
          .map((c) => ({
            name: c.name.common,
            flag: c.flags.svg,
            code: c.cca2,
            dialCode: `${c.idd.root}${c.idd.suffixes ? c.idd.suffixes[0] : ""}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countryData);
        setSelectedCountry(countryData.find((c) => c.code === "IN"));
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Send OTP
  const handleSendOtp = (phone) => {
    setSending(true);
    dispatch(generateOtp()); // ✅ use Redux slice to generate OTP
    setOtpError(null);

    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      alert(`OTP sent to ${selectedCountry.dialCode}${phone}`);
    }, 1500);
  };

  const onSubmit = (data) => {
    handleSendOtp(data.phone);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (otpValue === otpValueFromRedux) {
      setOtpError(null);
      alert("OTP Verified ✅");
      dispatch(clearOtp());   // clear Redux OTP
      setOtpSent(false);      // back to phone screen
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(phoneValue);
      }
    } else {
      setOtpError("❌ OTP is wrong, please try again.");
    }
  };

  // Accessibility helpers
  const handlePhoneKeyDown = (e) => {
    if (e.key === "Enter" && phoneValue && !sending) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleOtpKeyDown = (e) => {
    if (e.key === "Enter" && otpValue && otpValue.length === 4) {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleCountryKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      e.target.click();
    }
  };

  const handleButtonKeyDown = (e, action) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // Loader until countries load
  if (!selectedCountry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-sm">Loading countries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-800 rounded-2xl p-8 shadow-xl backdrop-blur-xl">

        {/* ✅ Show OTP until verified */}
        {otpSentFromRedux && otpValueFromRedux && (
          <p className="text-center mb-4 text-green-400">
            Your OTP (for testing): <strong>{otpValueFromRedux}</strong>
          </p>
        )}

        {/* Phone number form (before OTP is sent) */}
        {!otpSent ? (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-400 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Country selection */}
              <div>
                <label htmlFor="country-select" className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country-select"
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = countries.find((c) => c.code === e.target.value);
                      setSelectedCountry(country);
                    }}
                    onKeyDown={handleCountryKeyDown}
                    className="w-full bg-gray-800 text-white text-lg rounded-lg px-4 py-3 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-gray-900 text-white">
                        {c.flag ? "🌍 " : ""} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label htmlFor="phone-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className={`flex rounded-lg overflow-hidden border ${errors.phone ? "border-red-500" : "border-gray-700"} focus-within:border-purple-500`}>
                  <span className="px-4 flex items-center bg-gray-800 text-gray-300" aria-hidden="true">
                    {selectedCountry.dialCode}
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="Enter your number"
                    {...register("phone")}
                    onKeyDown={handlePhoneKeyDown}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white placeholder-gray-500 outline-none"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Send OTP button */}
              <button
                type="submit"
                disabled={sending || !phoneValue}
                onKeyDown={(e) => handleButtonKeyDown(e, handleSubmit(onSubmit))}
                className={`w-full py-3 rounded-lg text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  sending || !phoneValue
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                }`}
              >
                {sending ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* OTP verification screen */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Verify Code</h2>
              <p className="text-gray-400 mt-2">Code sent to</p>
              <p className="text-lg font-medium text-white" aria-live="polite">
                {selectedCountry.dialCode} {phoneValue}
              </p>
            </div>

            <div className="space-y-6">
              {/* OTP input */}
              <div>
                <label htmlFor="otp-input" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                  Enter 4-digit OTP
                </label>
                <input
                  id="otp-input"
                  type="text"
                  maxLength="4"
                  placeholder="0000"
                  {...register("otp")}
                  onKeyDown={handleOtpKeyDown}
                  className={`w-full text-center text-2xl font-bold tracking-widest px-4 py-4 rounded-lg border outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    errors.otp ? "border-red-500" : "border-gray-700 focus:border-green-500"
                  } bg-gray-900 text-white placeholder-gray-500`}
                  autoFocus
                />
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-400 text-center" role="alert">
                    {errors.otp.message}
                  </p>
                )}
                {otpError && (
                  <p className="mt-2 text-sm text-red-400 text-center" role="alert">
                    {otpError}
                  </p>
                )}
              </div>

              {/* Verify button */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                onKeyDown={(e) => handleButtonKeyDown(e, handleVerifyOtp)}
                disabled={!otpValue || otpValue.length !== 4}
                className={`w-full py-3 rounded-lg text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  !otpValue || otpValue.length !== 4
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                }`}
              >
                Verify & Continue
              </button>

              {/* Resend OTP */}
              <button
                type="button"
                onClick={() => handleSendOtp(phoneValue)}
                onKeyDown={(e) => handleButtonKeyDown(e, () => handleSendOtp(phoneValue))}
                disabled={sending}
                className="w-full text-sm text-purple-400 hover:text-purple-300 transition rounded py-1"
              >
                Didn't get the code? Resend
              </button>

              {/* Back button */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                onKeyDown={(e) => handleButtonKeyDown(e, () => setOtpSent(false))}
                className="w-full text-sm text-gray-400 hover:text-white transition rounded py-1"
              >
                ← Change phone number
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
