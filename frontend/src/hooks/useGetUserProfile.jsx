import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {  setUserProfile } from "../redux/authSlice";

const useGetUserProfile= (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:6060/api/v1/user/profile/${userId}`, {
          withCredentials: true,
        });

        console.log("Fetched posts:", response.data.posts); // logging posts
        if (response.data.success) { 
          dispatch(setUserProfile(response.data.user)); // Correct mapping here
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;


