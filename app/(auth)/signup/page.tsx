"use client";
import { api } from "@/app/lib/api";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<FormErrors>>({});
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = ({
    name,
    email,
    password,
    phone,
  }: FormData): Partial<FormErrors> => {
    const newErrors: Partial<FormErrors> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Invalid email";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone number must be 10 digits";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowOtpInput(true); // show OTP input
        setMessage("OTP sent to your phone/email");
      } else {
        const data = await res.json();
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await api("/auth/verifyOtp", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, otp }),
      });

      if (res.ok) {
        setMessage("Account verified!");
      } else {
        const data = await res.json();
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage("OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Signup</h2>
      {message && (
        <p className="text-center text-sm text-blue-500">{message}</p>
      )}

      {!showOtpInput ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

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

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            type="tel"
            className="border p-2 w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          <button
            type="submit"
            className="bg-gray-900 hover:bg-white text-white hover:text-black border hover:border-gray-900 duration-200 p-2 w-full"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <input
            type="tel"
            value={otp}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-digits
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
            Already have an account? <Link href="/login">Login</Link>
          </div>
          <div className="text-sm">Forget Password?</div>
        </div>
      )}
    </div>
  );
}
