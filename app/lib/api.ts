// app/lib/api.ts
// const BASE_URL = "https://gift-shops-backend.onrender.com/api/v1";
const BASE_URL = "http://localhost:5000/api/v1";

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
};
