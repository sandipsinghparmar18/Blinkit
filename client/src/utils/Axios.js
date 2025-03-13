import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  logoutUser,
} from "../store/authService.js";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASEURL, // Your API base URL
  withCredentials: true, // To send cookies
});

// Add a request interceptor
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken(); // Get current access token
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
Axios.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;

    // If the response is 401 (Unauthorized) and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        // Get refresh token and request a new access token
        const refreshToken = getRefreshToken();
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/user/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        setAccessToken(data.message.accessToken); // Save new access token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.message.accessToken}`;

        // Retry the original request with the new token
        return Axios(originalRequest);
      } catch (err) {
        console.error("Refresh token expired:", err);
        logoutUser(); // Clear tokens and redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
