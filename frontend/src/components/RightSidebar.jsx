import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:flex flex-col gap-6 w-72 fixed top-20 right-6 bg-white p-5 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
      {/* Profile Section */}
      <Link
        to={`/profile/${user?._id}`}
        className="flex flex-col items-center text-center hover:bg-gray-50 p-3 rounded-md transition"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-base font-semibold text-gray-800">{user?.username}</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.bio || "This is your bio"}</p>
      </Link>

      {/* Divider */}
      <div className="border-t"></div>

      {/* Suggested Users */}
      <SuggestedUser />
    </div>
  );
};

export default RightSidebar;
