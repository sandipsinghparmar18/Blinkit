import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function Dashboard() {
  const user = useSelector((state) => state.user);
  console.log(user);
  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]">
        {/** Left for menu */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block xl:block border-r">
          <UserMenu />
        </div>

        {/** Right for content */}
        <div className="bg-white min-h-[75vh]">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
