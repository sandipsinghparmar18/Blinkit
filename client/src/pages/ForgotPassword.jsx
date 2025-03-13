import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState({
    email: "",
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/user/forgot-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      addToast("Send otp to mail Successfully", "success");
      navigate("/verify-otp", {
        state: data,
      });
      setData({
        email: "",
      });
    } catch (error) {
      console.error("Forgot Password error: ", error);
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

  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <p className=" font-semibold text-lg text-center">Forgot Password</p>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded"
              value={data.email}
              name="email"
              placeholder="Enter email"
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
            Send
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

export default ForgotPassword;
