import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/postSlice";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get("http://localhost:6060/api/v1/post/all", {
          withCredentials: true,
        });

        console.log("Fetched posts:", response.data.posts); // logging posts
        if (response.data.success) {
          dispatch(setPosts(response.data.posts)); // Correct mapping here
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchAllPosts();
  }, []);
};

export default useGetAllPosts;
