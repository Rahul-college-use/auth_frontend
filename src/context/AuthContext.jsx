import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingOTP, setPendingOTP] = useState(null);

  // ================= AUTH CHECK ON REFRESH =================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // console.log("Checking auth with token:", token);

        if (!token) {
          setUser(null);
          return;
        }

        const res = await authService.getCurrentUser();
        // console.log("Auth check response:", res.user);

        // Backend /get-me doesn't return verified, so default to true
        if (res.user) {
          res.user.verified = res.user.verified !== undefined ? res.user.verified : true;
        }

        setUser(res.user || null);
        // console.log("User set to:", res.user);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ================= REGISTER =================
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      return await authService.register(username, email, password);
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login(email, password);


      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
      }

      
      if (res?.user) {
        setUser(res.user);

        if (!res.user.verified) {
          setPendingOTP(email);
        } else {
          setPendingOTP(null);
        }
      }

      return res;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY EMAIL =================
  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyEmail(email, otp);

      if (res?.user) {
        setUser(res.user);
        setPendingOTP(null);
      }

      return res;
    } catch (err) {
      setError(err.message || "Verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= REQUEST OTP =================
  const requestOTP = async (email) => {
    try {
      return await authService.requestOTP(email);
    } catch (err) {
      setError(err.message || "Failed to request OTP");
      throw err;
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT ALL =================
  const logoutAll = async () => {
    setLoading(true);

    try {
      await authService.logoutAll();
      setUser(null);
    } catch (err) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= CONTEXT VALUE =================
  const value = {
    user,
    loading,
    error,
    pendingOTP,

    register,
    login,
    logout,
    logoutAll,
    verifyEmail,
    requestOTP,

    // IMPORTANT: derived state (NOT localStorage)
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("useAuth context:", context);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};