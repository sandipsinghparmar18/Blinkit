import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import Axios from "../utils/Axios";

function ResetPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const location = useLocation();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const valideValue = Object.values(data).every((el) => el);
  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/forgot-password");
    }
    if (location?.state?.email) {
      setData({ ...data, email: location?.state?.email });
    }
  }, []);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      addToast("Error! Password and Confirm must be same.", "error");
      return;
    }
    try {
      const response = await Axios.put(`/api/user/reset-password`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      addToast("Password reset Successfully", "success");
      navigate("/login");
      setData({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Reset Password error: ", error);
      if (error.response) {
        addToast("Error! " + error.response.data.message, "error");
      } else {
        addToast(
          "Error! Something went wrong. Please try again later.",
          "error"
        );
      }
    }
  };

  //console.log("Resetting password", location);
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className=" font-semibold text-lg text-center">
          Enter Your Password
        </p>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="newPassword">New Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-2">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="w-full outline-none"
                value={data.newPassword}
                name="newPassword"
                placeholder="Enter Password"
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className=" cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="confirmPassword">Cofirm Password :</label>
            <input
              type="password"
              id="confirmPassword"
              className="bg-blue-50 p-2 border rounded"
              value={data.confirmPassword}
              name="confirmPassword"
              placeholder="Enter cofirm password"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={!valideValue}
            className={`${
              valideValue
                ? "bg-green-800 cursor-pointer hover:bg-green-600"
                : "bg-gray-500"
            } py-2 rounded-lg text-white font-semibold my-3 tracking-wide`}
          >
            Reset
          </button>
        </form>
        <p className="text-center text-gray-500 pt-2">
          Don't have an account?{" "}
          <span className="text-blue-500">
            <Link to={"/register"}>Register</Link>
          </span>
        </p>
      </div>
    </section>
  );
}

export default ResetPassword;
