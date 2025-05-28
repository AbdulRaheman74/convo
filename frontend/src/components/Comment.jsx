import React from 'react';

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          <img
            src={comment?.author?.profilePicture}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <h1 className="text-sm font-medium text-gray-800">
          {comment?.author?.username} <span>{comment.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
