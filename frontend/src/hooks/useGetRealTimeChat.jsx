import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setOnlineUsers } from "../redux/chatSlice";

const useGetRealTimeChat = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!socket || !user?._id) return;

    // ✅ Emit user to backend for tracking online status
    socket.emit("addUser", user._id);

    // ✅ Listen to incoming real-time messages
    const handleNewMessage = (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    };

    // ✅ Listen to online users list
    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users)); // list of online user IDs
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [socket, user, messages, dispatch]);

  return null;
};

export default useGetRealTimeChat;
