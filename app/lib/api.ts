// app/lib/api.ts
// const BASE_URL = "https://gift-shops-backend.onrender.com/api/v1";
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://gift-shops-backend.onrender.com/api/v1"
    : "http://localhost:5000/api/v1";

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add any default headers here
  };

  const config: RequestInit = {
    ...options,
    credentials: 'include', // This is crucial for cookies
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    return res;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
