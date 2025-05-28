import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../redux/authSlice";
import { MessageCircle } from "lucide-react";
import Messages from "./Messages";
import { setMessages } from "../redux/chatSlice";
import axios from "axios";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  const handleUserClick = (clickedUser) => {
    dispatch(setSelectedUsers(clickedUser));
    setHasUserInteracted(true);
    setShowChat(true);
  };

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:6060/api/v1/message/send/${receiverId}`,
        { message: textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setMessages([...messages, response.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error(error.message);
      alert("Failed to send message");
    }
  };

  // Auto scroll to bottom only when needed
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 50;

      if (isAtBottom || prevMessagesLength.current < messages.length) {
        container.scrollTop = container.scrollHeight;
      }

      prevMessagesLength.current = messages.length;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedUsers(null));
    };
  }, [dispatch]);

  return (
    <div className="p-4 mx-auto space-y-4   md:ml-64">
      <div>
        <h1 className="text-2xl font-bold  text-gray-800">{user?.username}</h1>
        <hr className="my-2 border-gray-300" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-full md:w-1/3 ${showChat ? "hidden md:block" : "block"} overflow-y-auto`}>
          <h2 className="font-semibold mb-4 text-gray-700">Chats</h2>
          <div className="space-y-4">
            {suggestedUsers?.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser._id);
              return (
                <div
                  key={suggestedUser._id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleUserClick(suggestedUser)}
                >
                  <img
                    src={suggestedUser?.profilePicture}
                    alt={`${suggestedUser?.username}'s profile`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{suggestedUser?.username}</span>
                    <span className={`text-sm ${isOnline ? "text-green-600" : "text-red-600"}`}>
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chat Window */}
        <div className={`w-full md:w-2/3 ${!showChat ? "hidden md:block" : ""} flex flex-col overflow-hidden`}>
          {!hasUserInteracted || !selectedUser ? (
            <div className="flex flex-col items-center justify-center mt-10 text-center text-gray-500 space-y-2 flex-1">
              <MessageCircle className="w-24 h-24 text-gray-400" />
              <h1 className="text-xl font-semibold">Your Messages</h1>
              <span>Select a user to start chatting...</span>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-4 p-4 border-b">
                <button className="md:hidden text-blue-500" onClick={() => setShowChat(false)}>
                  ← Back
                </button>
                <img
                  src={selectedUser?.profilePicture}
                  alt="user"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <span className="text-lg font-semibold text-gray-700">
                  {selectedUser?.username}
                </span>
              </div>

              {/* Chat Messages Area */}
              <div
                ref={messagesEndRef}
                className="flex-1 overflow-y-auto pr-2 space-y-3"
                style={{ maxHeight: 'calc(100% - 120px)' }}
              >
                <Messages selectedUser={selectedUser} />
              </div>

              {/* Input Section */}
              <div className="border-t p-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-full outline-none w-full"
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                />
                <button
                  className={`px-4 py-2 rounded-full text-white ${
                    textMessage.trim()
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={!textMessage.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
