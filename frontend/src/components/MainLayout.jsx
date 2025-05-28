import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./leftSidebar";
// import LeftSidebar from "./LeftSidebar"; // Make sure the component name matches

const MainLayout = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <main className="flex-1 p-6 w-100% bg-gray-50 min-h-screen">
        <Outlet /> {/* This renders the matched route component */ }
      </main>
    </div>
  );
};

export default MainLayout;