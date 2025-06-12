"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AuthCheck() {
  const [authState, setAuthState] = useState({
    localStorageToken: null as string | null,
    cookieToken: null as string | null,
  });

  useEffect(() => {
    // Check authentication state
    const localStorageToken = localStorage.getItem("token");
    const cookieToken = Cookies.get("token") ?? null; // FIXED

    setAuthState({
      localStorageToken,
      cookieToken,
    });

    // Log auth state
    console.log("Auth State:", {
      localStorageToken,
      cookieToken,
    });
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div>
        <p>LocalStorage Token: {authState.localStorageToken ? "✅" : "❌"}</p>
        <p>Cookie Token: {authState.cookieToken ? "✅" : "❌"}</p>
      </div>
    </div>
  );
}
