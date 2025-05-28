import React, { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

// Components
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import MainLayout from "./components/MainLayout.jsx";
import ChatPage from "./components/ChatPage.jsx";

// Socket.io and Redux
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice.js";
import { setOnlineUsers } from "./redux/chatSlice.js";
import { setLikeNotification } from "./redux/rtnSlice.js";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center">
          <h1 className="text-xl text-red-600 font-bold">
            Something went wrong. Please try again later.
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
const App = () => {
 const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:6060', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

     socketio.on('notification', (notification) => {
  console.log('Notification received from socket:', notification);
  dispatch(setLikeNotification(notification));
});

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);


  return (
    <ErrorBoundary>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Layout with Sidebar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/account/edit" element={<EditProfile />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>

          {/* Optional: 404 Page */}
          <Route path="*" element={<div className="text-center mt-10">404 - Page Not Found</div>} />
        </Routes>

        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
