import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import fetchUserDetails from "./utils/fetchUserDetails";
import { useEffect } from "react";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data.message));
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
