import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UpdateAvatar from "../components/UpdateAvatar";
import Axios from "../utils/Axios";
import { setUserDetails } from "../store/userSlice";
import { useToast } from "../context/ToastContext";

function Profile() {
  const { addToast } = useToast();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [openAvatarUpdate, setOpenAvatarUpdate] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    mobile: user.mobile,
    email: user.email,
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setUserData({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
    });
  }, [user]);
  const handleOnChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.patch("/api/user/update-profile", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(setUserDetails(response.data.message));
      setLoading(false);
      addToast("Profile updated successfully", "success");
    } catch (error) {
      setLoading(false);
      addToast("Error! Failed to update profile.", "error");
      console.error(error);
    }
  };
  return (
    <div className="xl:px-4 lg:py-4">
      {/* update avatar */}
      <div className="flex items-center justify-center">
        <div>
          <div className="w-25 h-25 bg-red-300 flex items-center justify-center  rounded-full overflow-hidden drop-shadow-md">
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
          <button
            onClick={() => setOpenAvatarUpdate(true)}
            className="text-sm min-w-20 border border-yellow-400 ml-3 px-3 py-1 rounded-full mt-3 cursor-pointer hover:bg-yellow-400"
          >
            Edit
          </button>
        </div>
      </div>

      {openAvatarUpdate && (
        <UpdateAvatar close={() => setOpenAvatarUpdate(false)} />
      )}
      {/* name,mobile,email,change Password */}
      <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Your Name"
            value={userData.name}
            onChange={handleOnChange}
            name="name"
            required
            className="p-2 bg-blue-50 outline-none border focus-within:border-yellow-400 rounded"
          />
        </div>
        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter Your Email"
            value={userData.email}
            onChange={handleOnChange}
            name="email"
            className="p-2 bg-blue-50 outline-none border focus-within:border-yellow-400 rounded"
          />
        </div>
        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your Number"
            value={userData.mobile}
            onChange={handleOnChange}
            name="mobile"
            required
            className="p-2 bg-blue-50 outline-none border focus-within:border-yellow-400 rounded"
          />
        </div>
        <button className=" border border-yellow-400 px-4 py-2 font-semibold  hover:bg-yellow-300 cursor-pointer rounded">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
