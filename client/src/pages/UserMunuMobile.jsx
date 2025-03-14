import React from "react";
import UserMenu from "../components/UserMenu";
import { IoMdClose } from "react-icons/io";

function UserMunuMobile() {
  return (
    <section className="bg-white h-full w-full p-2">
      <button
        onClick={() => window.history.back()}
        className=" text-neutral-800 block ml-auto cursor-pointer"
      >
        <IoMdClose size={25} />
      </button>
      <div className=" container mx-auto px-3 pb-8">
        <UserMenu />
      </div>
    </section>
  );
}

export default UserMunuMobile;
