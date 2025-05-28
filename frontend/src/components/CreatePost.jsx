import React, { useState, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = ({ text, setText }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { posts } = useSelector((store) => store.post); // Ensure your slice is named `post`
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);

    // Reset file input to allow re-selection of the same file
    e.target.value = null;
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!caption && !file) {
      return toast.error("Add a caption or image!");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (file) {
      formData.append("image", file);
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:6060/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts]));
        toast.success(response.data.message);
        setCaption("");
        setFile(null);
        setPreview("");
        setText(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!text) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4 shadow-xl transition duration-300 ease-in-out">
        <h2 className="text-center font-semibold text-xl">Create Post</h2>

        <form onSubmit={handlePost} className="space-y-4">
          <textarea
            className="w-full border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {preview && (
            <div className="relative w-full h-64 rounded overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove image"
                tabIndex={0}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="image-upload"
            className="hidden"
          />

          <label
            htmlFor="image-upload"
            className="block w-full text-center bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            {file ? "Change Image" : "Select Image"}
          </label>

          <button
            type="submit"
            disabled={loading || (!caption && !file)}
            className="w-full bg-black text-white py-2 rounded flex items-center justify-center disabled:opacity-70"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Posting..." : "Post"}
          </button>

          <button
            type="button"
            onClick={() => setText(false)}
            className="w-full text-center text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
