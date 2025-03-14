import Axios from "./Axios";
const fetchUserDetails = async () => {
  try {
    const response = await Axios.get("/api/user/user-details", {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log("fetch User Detials Error", error);
  }
};

export default fetchUserDetails;
