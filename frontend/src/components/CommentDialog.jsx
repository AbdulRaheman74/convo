import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "react-toastify";
import { setPosts } from "../redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const boxRef = useRef(null);
  const [input, setinput] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState(selectedPost?.comments || []);
  const dispatch = useDispatch();

  // Sync local comment state when selectedPost changes
  useEffect(() => {
    setComment(selectedPost?.comments || []);
  }, [selectedPost]);

  // Close if clicked outside the dialog
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, setOpen]);

  // Handle input change
  const handleInputChange = (e) => {
    const inputText = e.target.value;
    setinput(inputText.trim() ? inputText : "");
  };

  // Handle sending comment
  const sendMessageHandel = async () => {
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/post/${selectedPost?._id}/comment`,
        { text: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newComment = response.data.comment;
        const updatedCommentData = [newComment, ...comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        setinput(""); // Clear input
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={boxRef}
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-lg text-gray-600 hover:text-black"
        >
          ×
        </button>

        {/* Post Image + Info */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={selectedPost?.image}
            alt="Post"
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h2 className="font-semibold text-gray-800">
              {selectedPost?.author.username}
            </h2>
            <p className="text-sm text-gray-400">
              “Enjoying the scenic view 🌄”
            </p>
          </div>
        </div>

        {/* ✅ Render updated local comment state */}
        {comment?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}

        {/* Add Comment */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            onChange={handleInputChange}
            value={input}
          />
          <button
            disabled={!input.trim()}
            className="text-blue-500 text-sm font-semibold hover:underline"
            onClick={sendMessageHandel}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
