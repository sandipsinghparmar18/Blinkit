import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import { useToast } from "../context/ToastContext";
import { updatedAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";
function UpdateAvatar({ close }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      const response = await Axios.put(`/api/user/upload-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(updatedAvatar(response.data.message.avatar));
      setLoading(false);
      addToast("Avatar updated successfully.", "success");
    } catch (error) {
      setLoading(false);
      addToast("Error! Failed to update avatar.", "error");
    }
  };
  return (
    <section className=" fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center">
        <button
          onClick={close}
          className="text-neutral-800 w-fit block ml-auto cursor-pointer"
        >
          <IoClose size={20} />
        </button>
        <div className="w-35 h-35 bg-red-300 flex items-center justify-center  rounded-full overflow-hidden drop-shadow-md">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Profile"
              className="w-full h-full"
            />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            <div className="border border-yellow-400 hover:bg-yellow-500 px-3 py-2 rounded text-sm my-3 cursor-pointer">
              {loading ? "Loading..." : "Upload"}
            </div>
          </label>
          <input
            onChange={handleUploadAvatar}
            type="file"
            id="uploadProfile"
            className="hidden"
          />
        </form>
      </div>
    </section>
  );
}

export default UpdateAvatar;
