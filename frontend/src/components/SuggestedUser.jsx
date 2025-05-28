import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SuggestedUser = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Suggested for you
        </h2>
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-blue-500 dark:text-blue-400 text-xs cursor-pointer hover:underline font-medium"
        >
          See All
        </motion.span>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <motion.div
              key={user._id}
              variants={item}
              className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 dark:hover:bg-gray-700 group"
            >
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user._id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-10 h-10 rounded-full overflow-hidden border border-blue-400 shadow-sm"
                  >
                    <img
                      src={user?.profilePicture || "https://via.placeholder.com/150"}
                      alt={`${user?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </Link>

                <div className="flex flex-col">
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    {user?.username || "Username"}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[120px]">
                    {user?.bio || "Bio not available"}
                  </p>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-500 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500 dark:border-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300"
              >
                Follow
              </motion.button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
            No suggestions available
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SuggestedUser;