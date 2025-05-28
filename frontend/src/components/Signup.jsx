import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus, Mail, Lock, Moon, Sun } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6060/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.log(error);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="self-end m-4 p-2 rounded-full bg-opacity-20 bg-white hover:bg-opacity-30 dark:bg-gray-700 transition-transform duration-300"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Content Container */}
      <div className="flex-grow flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:w-full sm:max-w-md w-full">
          {/* Logo + Name */}
         <div className="text-center mb-6">
  <div className="flex justify-center items-center space-x-3">
    <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
      C
    </div>
    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
      Convo
    </h1>
  </div>
  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
    Have the convo. Share your side.
  </p>
</div>
          {/* Form Card */}
          <div
            className={`py-8 px-6 shadow rounded-lg sm:px-10 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <form onSubmit={signupHandler} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <UserPlus
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={input.username}
                    onChange={changeEventHandler}
                    required
                    placeholder="Enter username"
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    required
                    placeholder="Enter email"
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={input.password}
                    onChange={changeEventHandler}
                    required
                    placeholder="Enter password"
                    className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-white text-gray-500"
                  }`}
                >
                  OR
                </span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-4 text-xs text-center text-gray-500">
              By signing up, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Terms
              </a>
              ,{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Privacy Policy
              </a>
              , and{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Cookies Policy
              </a>
              .
            </div>
          </div>

          {/* Login Prompt */}
          <div
            className={`mt-6 py-4 px-4 text-center text-sm ${
              darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
            } shadow rounded-lg`}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
