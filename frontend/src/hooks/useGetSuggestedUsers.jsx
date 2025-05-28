import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get("http://localhost:6060/api/v1/user/suggested", {
          withCredentials: true,
        });

        if (response.data.success) { 
          dispatch(setSuggestedUsers(response.data.users)); // Correct mapping here
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUsers;


