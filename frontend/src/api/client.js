export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const AUTH_STORAGE_KEY = "job-tracker-auth";

const getToken = () => {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    return JSON.parse(storedAuth).token;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Something went wrong.");
    error.status = response.status;
    throw error;
  }

  return data;
};
