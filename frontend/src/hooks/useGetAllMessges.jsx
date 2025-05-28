import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";

const useGetAllMesssges = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return; // Avoid making request if no user selected

    const fetchAllMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6060/api/v1/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );

        // The backend returns success and messages keys
        console.log("Fetched messages:", response.data.messages);

        if (response.data.success) {
          dispatch(setMessages(response.data.messages)); // Note: messages plural
        }
      } catch (error) {
        // `error.message` not `error.messages`
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useGetAllMesssges;
