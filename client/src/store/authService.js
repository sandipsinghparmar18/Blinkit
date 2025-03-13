import Axios from "../utils/Axios";
export const getAccessToken = () => localStorage.getItem("accessToken");

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const logoutUser = async () => {
  try {
    // Send request to backend to clear the refresh token cookie
    await Axios.post("/api/user/logout", {}, { withCredentials: true });

    // Remove access token from local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Redirect user to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
};
