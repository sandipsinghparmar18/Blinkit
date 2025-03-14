import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerify from "../pages/OtpVerify";
import ResetPassword from "../pages/ResetPassword";
import UserMunuMobile from "../pages/UserMunuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import Myorder from "../pages/Myorder";
import Address from "../pages/Address";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <OtpVerify />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "user",
        element: <UserMunuMobile />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "myorders",
            element: <Myorder />,
          },
          {
            path: "address",
            element: <Address />,
          },
        ],
      },
    ],
  },
]);

export default router;
