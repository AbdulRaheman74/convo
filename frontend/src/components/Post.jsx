import React, { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { Link } from "react-router-dom";
import { setAuthUser } from "../redux/authSlice";

const Post = ({ post }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user._id));
  const [postLiked, setPostLiked] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks?.includes(post._id)
  );

  const dispatch = useDispatch();

  const changeHandler = (e) => setText(e.target.value.trimStart());

  const likeOrDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const response = await axios.put(
        `http://localhost:6060/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setPostLiked(liked ? postLiked - 1 : postLiked + 1);
        setLiked(!liked);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/post/${post._id}/comment`,
        { text },
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
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:6060/api/v1/post/delete/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:6060/api/v1/post/bookmark/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsBookmarked(!isBookmarked);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to bookmark.");
    }
  };

  const followUnFollowHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/user/followOrUnfolloew/${post.author._id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedFollowing = user.following.includes(post.author._id)
          ? user.following.filter((id) => id !== post.author._id)
          : [...user.following, post.author._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="w-full rounded-lg bg-white  shadow-sm hover:shadow-lg transition-all duration-300 my-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 w-60">
          <Link to={`/profile/${post.author._id}`}>
            <img
              src={post.author.profilePicture}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
              alt="profile"
            />
          </Link>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {post.author.username}
            </p>
            <p className="text-xs text-gray-400">2 hours ago</p>
          </div>
        </div>
        <div className="relative">
          <MoreHorizontal
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer hover:text-black text-gray-500"
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-30">
              {user._id !== post.author._id && (
                <button
                  onClick={followUnFollowHandler}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {user.following.includes(post.author._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={bookmarkHandler}
              >
                {isBookmarked ? "Remove Bookmark" : "Save Post"}
              </button>
              {user._id === post.author._id && (
                <button
                  onClick={deletePostHandler}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-[400px] bg-gray-100 overflow-hidden">
        <img
          src={post.image}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          alt="post"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <FaHeart
            size={22}
            className={`cursor-pointer transition-transform hover:scale-110 ${
              liked ? "text-red-500" : "text-gray-600 hover:text-red-400"
            }`}
            onClick={likeOrDislike}
          />
          <MessageCircle
            size={22}
            className="cursor-pointer text-gray-600 hover:text-blue-500 transition-transform hover:scale-110"
            onClick={() => {
              setOpen(true);
              dispatch(setSelectedPost(post));
            }}
          />
          <Send
            size={22}
            className="cursor-pointer text-gray-600 hover:text-green-500 transition-transform hover:scale-110"
          />
        </div>
        {isBookmarked ? (
          <BookmarkCheck
            size={22}
            className="text-yellow-500 cursor-pointer"
            onClick={bookmarkHandler}
          />
        ) : (
          <Bookmark
            size={22}
            className="text-gray-600 hover:text-yellow-500 cursor-pointer"
            onClick={bookmarkHandler}
          />
        )}
      </div>

      {/* Details */}
      <div className="px-4 pb-4">
        <p className="text-sm font-semibold">{postLiked} likes</p>
        <p className="text-sm text-gray-700">
          <span className="font-bold">{post.author.username}</span>{" "}
          {post.caption}
        </p>
        <button
          className="text-xs text-gray-400 mt-1"
          onClick={() => {
            setOpen(true);
            dispatch(setSelectedPost(post));
          }}
        >
          View all {comment.length} comments
        </button>
        <CommentDialog open={open} setOpen={setOpen} />
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-1 text-sm focus:ring-1 focus:ring-blue-400 outline-none"
            placeholder="Add a comment..."
            value={text}
            onChange={changeHandler}
          />
          {text && (
            <button
              className="text-blue-500 text-sm font-semibold"
              onClick={commentHandler}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
