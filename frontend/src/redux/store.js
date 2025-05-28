import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from "./postSlice.js";
import socketSlice from './socketSlice.js';
import chatSlice from './chatSlice.js';
import rtnSlice from './rtnSlice.js'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist config for auth only
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "realTimeNotification"], // 👈 Add this
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification:rtnSlice
  
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "socketio/setSocket", // ✅ Ignore this action
        ],
        ignoredPaths: [
          "socketio.socket",     // ✅ Ignore this part of the state
        ],
      },
    }),
});

export default store;
