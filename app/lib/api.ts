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

  // Get token from localStorage if available
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug log
  }

  const config: RequestInit = {
    ...options,
    credentials: 'include', // This is crucial for cookies
    headers: {
      ...defaultHeaders,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };

  console.log('Request headers:', config.headers); // Debug log

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // If the response includes a new token in the header, update it
    const newToken = res.headers.get('x-auth-token');
    if (newToken && typeof window !== 'undefined') {
      localStorage.setItem('token', newToken);
      console.log('New token received:', newToken); // Debug log
    }
    
    return res;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
