import React, { useEffect, useRef, useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const valideValue = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_BASEURL
        }/api/user/verify-forgot-password-otp`,
        {
          otp: data.join(""),
          email: location?.state?.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      addToast("Otp verify Successfully", "success");
      setData(["", "", "", "", "", ""]);
      navigate("/reset-password", {
        state: {
          data: response.data,
          email: location?.state?.email,
        },
      });
    } catch (error) {
      console.error("Otp verify error: ", error);
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
        <p className=" font-semibold text-lg text-center">Enter Otp</p>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Otp :</label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((element, index) => {
                return (
                  <input
                    type="text"
                    key={"otp" + index}
                    id="otp"
                    ref={(ref) => {
                      inputRef.current[index] = ref;
                      return ref;
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      setData(
                        data.map((el, i) => (i === index ? e.target.value : el))
                      );
                      if (e.target.value && index < 5) {
                        inputRef.current[index + 1].focus();
                      }
                    }}
                    maxLength={1}
                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-yellow-400 text-center font-semibold"
                  />
                );
              })}
            </div>
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
            Verify
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

export default OtpVerify;
