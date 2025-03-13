import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import useMobile from "../hooks/useMobile";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchpage] = useState(false);
  const [isMobile] = useMobile();
  useEffect(() => {
    setIsSearchpage(location.pathname === "/search");
  }, [location]);
  //console.log(isSearchPage);
  const redirectToSearch = () => {
    navigate("/search");
  };
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-amber-300">
      {isMobile && isSearchPage ? (
        <Link
          to={"/"}
          className="flex justify-center items-center h-full p-2 m-1 group-focus-within:text-amber-300 bg-white rounded-full shadow-md"
        >
          <IoMdArrowRoundBack size={22} />
        </Link>
      ) : (
        <button className="flex justify-center items-center h-full p-3 group-focus-within:text-amber-300">
          <IoMdSearch size={22} />
        </button>
      )}

      <div className="w-full h-full">
        {!isSearchPage ? (
          //not in search page
          <div
            onClick={redirectToSearch}
            className="w-full h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "rice"',
                1000,
                'Search "egg"',
                1000,
                'Search "cold-drink"',
                1000,
                'Search "chips"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search for atta dal and more."
              autoFocus={true}
              className="w-full h-full bg-transparent outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
