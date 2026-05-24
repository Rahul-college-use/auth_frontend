import client from "../api/client.js";

export const authService = {
  register: async (username, email, password) => {
    const response = await client.post("/register", {
      username,
      email,
      password
    });

    return response.data;
  },

  login: async (email, password) => {
    const response = await client.post("/login", { email, password });

    const { accessToken, user } = response.data;

    localStorage.setItem("accessToken", accessToken);

    return response.data;
  },

  verifyEmail: async (email, otp) => {
    const response = await client.post("/verify-email", {
      email,
      otp
    });

    // ⚠️ backend does NOT return tokens here
    // so DO NOT store tokens here

    return response.data;
  },

  requestOTP: async (email) => {
    const response = await client.post("/verify-email", {
      email
    });

    return response.data;
  },

  getCurrentUser: async () => {
    const response = await client.get("/get-me");
    return response.data;
  },

  logout: async () => {
    try {
      await client.get("/logout");
    } finally {
      localStorage.removeItem("accessToken");
    }
  },

  logoutAll: async () => {
    try {
      await client.get("/logout-all");
    } finally {
      localStorage.removeItem("accessToken");
    }
  },

  refreshToken: async () => {
    const response = await client.get("/refresh-token");

    // backend returns ONLY accessToken
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  }
};