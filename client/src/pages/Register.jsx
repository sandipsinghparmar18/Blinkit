import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      addToast("Error! Password and Confirm must be same.", "error");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/user/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      addToast("Registration successful! You can now login.", "success");
      setData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error: ", error);
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
        <p>Welcome to Blinkit</p>
        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              autoFocus
              id="name"
              className="bg-blue-50 p-2 border rounded"
              value={data.name}
              name="name"
              placeholder="Enter name"
              onChange={handleChange}
            />
          </div>
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
          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                value={data.password}
                name="password"
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
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 pt-2">
          Already have an account?{" "}
          <span className="text-blue-500">
            <Link to={"/login"}>Login</Link>
          </span>
        </p>
      </div>
    </section>
  );
}

export default Register;
