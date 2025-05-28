import React, { useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AtSign, Heart, MessageCircleCode } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { setAuthUser } from "../redux/authSlice";

const Profile = () => {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);
  const { user, userProfile } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [active, setActive] = useState("posts");

  const isLoggedInUserProfile = user?._id === userProfile._id;
  const isFollowing = user?.following?.includes(userProfile._id);

  const activeChangeHandler = (tab) => {
    setActive(tab);
  };

  const displayPosts =
    active === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  // Reusable follow/unfollow handler
  const followUnFollowHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/user/followOrUnfolloew/${userProfile._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        const updatedFollowing = isFollowing
          ? user.following.filter((id) => id !== userProfile._id)
          : [...user.following, userProfile._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-8 bg-white shadow-md rounded-xl p-6">
        {/* Profile Picture */}
        <div className="flex justify-center sm:block">
          <img
            src={
              userProfile?.profilePicture || "https://via.placeholder.com/150 "
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {userProfile?.username || "Username"}
            </h2>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      Edit Profile
                    </button>
                  </Link>
                  <button className="px-4 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
                    View Archive
                  </button>
                  <button className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                    Add Tools
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={followUnFollowHandler}
                    className={`px-4 py-1 text-sm rounded-md transition ${
                      isFollowing
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isFollowing ? "UnFollow" : "Follow"}
                  </button>
                  <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-700 text-sm">
            {userProfile?.bio || "Bio not provided"}
          </p>

          <div className="flex gap-6 text-sm text-gray-700 mt-2">
            <p>
              <span className="font-semibold">
                {userProfile?.posts?.length || 0}
              </span>{" "}
              Posts
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.followers?.length || 0}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="font-semibold">
                {userProfile?.following?.length || 0}
              </span>{" "}
              Following
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="hidden sm:flex flex-col gap-2 text-sm text-gray-800 bg-gray-50 p-4 rounded-lg shadow-md w-72">
          <span className="text-gray-600 italic">
            {userProfile?.bio || "Bio here...."}
          </span>
          <h1 className="flex items-center gap-1 font-semibold text-blue-600">
            <AtSign className="w-4 h-4" />
            <span>{userProfile?.username}</span>
          </h1>
          <span className="text-gray-700">Learn code with us</span>
          <span className="text-gray-700">Learn code with us</span>
          <span className="text-gray-700">Learn code with us</span>
          <span className="text-gray-700">Learn code with us</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-around text-sm font-medium text-gray-500">
          <button
            onClick={() => activeChangeHandler("posts")}
            className={`px-4 py-2 transition ${
              active === "posts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-gray-800"
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => activeChangeHandler("saved")}
            className={`px-4 py-2 transition ${
              active === "saved"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-gray-800"
            }`}
          >
            SAVED
          </button>
      
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {displayPosts?.map((post) => (
            <div
              key={post._id}
              className="relative group cursor-pointer aspect-square overflow-hidden"
            >
              <img
                src={post.image}
                alt="postimage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white text-xs">
                <button className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes.length}</span>
                </button>
                <button className="flex items-center gap-1">
                  <MessageCircleCode className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;