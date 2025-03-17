import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios.js";
import { logout } from "../store/userSlice.js";
import { useToast } from "../context/ToastContext";
import { HiExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin.js";

function UserMenu({ close }) {
  const { addToast } = useToast();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await Axios.post(`/api/user/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        addToast("Successfully Logout", "success");
        navigate("/");
        if (close) {
          close();
        }
      }
    } catch (error) {
      addToast("Error! Logout failed", "error");
      console.log("Logout Error", error);
    }
  };
  const handleClose = () => {
    if (close) {
      close();
    }
  };
  return (
    <div className=" lg:pl-4">
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}
          <span className="text-red-600 text-xs">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-yellow-500"
        >
          <HiExternalLink size={15} />
        </Link>
      </div>
      <Divider />
      <div className="text-sm grid gap-2">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subcategory"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            SubCategory
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Upload Product
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="px-2 hover:bg-orange-200 py-1"
          >
            Product
          </Link>
        )}
        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-2 hover:bg-orange-200 py-1"
        >
          Save Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-2 cursor-pointer hover:bg-orange-200 py-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
