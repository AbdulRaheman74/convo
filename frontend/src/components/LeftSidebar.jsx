import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  TrendingUp,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sidebarItems = [
    { icon: <Home size={22} />, text: "Home", action: () => navigate("/") },
    { icon: <Search size={22} />, text: "Search", action: () => {} },
    { icon: <TrendingUp size={22} />, text: "Explore", action: () => {} },
    { 
      icon: <MessageCircle size={22} />, 
      text: "Messages", 
      action: () => navigate("/chat") 
    },
    { 
      icon: <Heart size={22} />, 
      text: "Notifications", 
      action: () => setShowNotifications(!showNotifications),
      notificationCount: likeNotification.length 
    },
    { 
      icon: <PlusSquare size={22} />, 
      text: "Create", 
      action: () => setShowCreatePost(true) 
    },
  ];

  const logoutHandler = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6060/api/v1/user/logout",
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item.text);
    item.action();
    if (item.text !== "Notifications") {
      setShowNotifications(false);
    }
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={`fixed top-4 left-4 z-50 md:hidden p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transition-transform duration-300 ${
          isOpen ? 'rotate-90' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>
      )}

      {/* Sidebar content */}
      <div
        className={`sidebar-container fixed top-0 left-0 h-full w-64 sm:w-72 bg-white/95 backdrop-blur-sm border-r border-gray-100 p-6 flex flex-col justify-between transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        } md:translate-x-0 md:shadow-none`}
      >
        {/* Branding and User Profile */}
        <div>
          {/* Logo/Brand */}
          <div className="flex items-center justify-center md:justify-start mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-2 mr-3">
              <MessageCircle size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Convo
            </h1>
          </div>

          {/* User profile */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group mb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                <Link to={`profile/${user._id}`}>
                  <img
                    src={user?.profilePicture || "https://i.pravatar.cc/150?img=21 "}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
            <p className="text-sm text-gray-500">@{user.username.toLowerCase()}</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                activeItem === item.text
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className={`${activeItem === item.text ? "text-indigo-600" : "text-gray-500"}`}>
                {item.icon}
              </div>
              <span className="text-sm md:text-base">{item.text}</span>
              {item.notificationCount > 0 && (
                <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.notificationCount}
                </span>
              )}
              {activeItem === item.text && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-indigo-600 rounded-r-full"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Notifications dropdown */}
        {showNotifications && (
          <div 
            className={`absolute ${
              window.innerWidth < 768 ? "right-0 top-16" : "left-full top-1/2 -translate-y-1/2 ml-4"
            } w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50`}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <div>
              {likeNotification.length === 0 ? (
                <div className="p-6 text-center">
                  <Heart size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No new notifications</p>
                </div>
              ) : (
                likeNotification.map((notification, idx) => (
                  <div 
                    key={`${notification.userId}-${idx}`}
                    className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={notification.userDetails?.profilePicture || "https://i.pravatar.cc/150?img=5 "}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          <span className="font-semibold">{notification.userDetails?.username}</span> liked your post
                        </p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">Logout</span>
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && <CreatePost text={showCreatePost} setText={setShowCreatePost} />}
    </>
  );
};

export default LeftSidebar;