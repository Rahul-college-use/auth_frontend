import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


// Request interceptor - Add access token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  // console.log("Request config:", config)
  return config;
});

// Response interceptor - Handle 401 and refresh token
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const refreshToken = localStorage.getItem('refreshToken');
        // console.log("Attempting token refresh with refresh token:", refreshToken);
        if (!refreshToken) {
          throw new Error(response.data?.message || "No refresh token available");
        }

        const response = await axios.get(`${API_URL}/refresh-token`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // console.log(client(originalRequest));
        return client(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
