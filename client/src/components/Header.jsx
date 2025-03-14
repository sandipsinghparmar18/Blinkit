import React, { useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
function Header() {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  //console.log(user);
  const [openUserMenu, setOpneUserMenu] = useState(false);
  const handleCloseUserMenu = () => {
    setOpneUserMenu(false);
  };
  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };
  const redirectToLogin = () => {
    navigate("/login");
  };
  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className=" container mx-auto flex items-center px-2 justify-between">
          {/* Logo */}
          <Link className="h-full">
            <div className="h-full flex justify-center items-center">
              <img
                src={logo}
                alt="logo"
                width={170}
                height={60}
                className="hidden lg:block"
              />
              <img
                src={logo}
                alt="logo"
                width={120}
                height={60}
                className="lg:hidden"
              />
            </div>
          </Link>
          {/* search */}
          <div className=" hidden lg:block">
            <Search />
          </div>
          {/* login and cart */}
          <div>
            {/* for mobile version */}
            <button
              className="text-neutral-600 cursor-pointer lg:hidden"
              onClick={handleMobileUser}
            >
              <FaRegCircleUser size={26} />
            </button>
            {/* for desktop version */}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className=" relative">
                  <div
                    onClick={() => setOpneUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className=" absolute right-0 top-13">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLogin}
                  className="text-lg px-2 cursor-pointer"
                >
                  Login
                </button>
              )}
              <button className="flex items-center gap-2 bg-green-800 hover:bg-green-600 px-3 py-3 rounded-lg text-white shadow-md">
                <div className=" animate-bounce">
                  <FaCartShopping size={26} className="text-yellow-300" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">My Cart</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className=" container mx-auto px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
}

export default Header;
