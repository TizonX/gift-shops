"use client";
import { api } from "@/app/lib/api";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";

interface FormData {
  email: string;
  password: string;
}
interface FormErrors {
  email?: string;
  password?: string;
}
export default function SigninPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [message, setMessage] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.status === 1) {
        // Store the token if it exists in the response
        if (data.token) {
          localStorage.setItem("token", data.token);
          // Also store in cookies
          Cookies.set("token", data.token, { expires: 7 }); // Expires in 7 days
        }
        // Force a full page refresh to home page
        window.location.href = "/";
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (
        err?.message === "User not verified. OTP sent to your email." ||
        err?.message === "User not verified. Please share the OTP to verify"
      ) {
        setShowOtpInput(true);
        setMessage("OTP sent to your phone/email");
      } else {
        setMessage("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api("/auth/verifyOtp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store the token if it exists in the response
        if (data.token) {
          localStorage.setItem("token", data.token);
          // Also store in cookies
          Cookies.set("token", data.token, { expires: 7 }); // Expires in 7 days
        }
        setMessage("Account verified!");
        // Force a full page refresh to home page
        window.location.href = "/";
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      setMessage("OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>
      {message && (
        <p className="text-center text-sm text-blue-500">{message}</p>
      )}

      {!showOtpInput ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="border p-2 w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="submit"
            className="group bg-gray-900 hover:bg-white text-white hover:text-black border hover:border-gray-900 duration-200 p-2 w-full flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex space-x-1 items-center h-5">
                <span className="w-2 h-2 bg-white group-hover:bg-black rounded-sm animate-bounce [animation-delay:-0.2s]"></span>
                <span className="w-2 h-2 bg-white group-hover:bg-black rounded-sm animate-bounce [animation-delay:-0.1s]"></span>
                <span className="w-2 h-2 bg-white group-hover:bg-black rounded-sm animate-bounce"></span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="tel"
            value={otp}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setOtp(onlyNums);
            }}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="border p-2 w-full text-center tracking-widest"
          />
          <button
            type="submit"
            className="bg-gray-900 hover:bg-white text-white hover:text-black border hover:border-gray-900 duration-200  p-2 w-full"
          >
            Verify OTP
          </button>
        </form>
      )}

      {!showOtpInput && (
        <div className="flex justify-between text-blue-500">
          <div className="text-sm">
            {"Don't"} have an account? <Link href="/signup">Sign Up</Link>
          </div>
          <div className="text-sm">Forget Password?</div>
        </div>
      )}
    </div>
  );
}
