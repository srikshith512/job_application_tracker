import { createContext, useContext, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, apiRequest } from "../api/client.js";

const AuthContext = createContext(null);

const readStoredAuth = () => {
  const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return { user: null, token: null };
  }

  try {
    return JSON.parse(storedAuth);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const persistAuth = (authData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setAuth(authData);
  };

  const login = async (credentials) => {
    const authData = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    persistAuth(authData);
  };

  const register = async (payload) => {
    const authData = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    persistAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth({ user: null, token: null });
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      login,
      logout,
      register
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
