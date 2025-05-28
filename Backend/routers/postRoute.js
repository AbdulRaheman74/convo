// routes/postRoute.js
import express from "express";
import {
  addNewPost,
  getAllPosts,
  getUserPosts,
  likePosts,
  disLikePosts,
  addComments,
  getCommentsOfPosts,
  deletepost,
  bookmarkPost,
} from "../controller/postController.js";

import upload from "../middelwears/multer.js";
import isAuthenticate from "../middelwears/isAuthenticated.js";

const postRoute = express.Router();

postRoute.post("/addpost", isAuthenticate, upload.single("image"), addNewPost);
postRoute.get("/all", isAuthenticate, getAllPosts);
postRoute.get("/userpost/all", isAuthenticate, getUserPosts);

// ✅ Updated Like/Dislike endpoints to PUT and RESTful path
postRoute.put("/:id/like", isAuthenticate, likePosts);
postRoute.put("/:id/dislike", isAuthenticate, disLikePosts);

postRoute.post("/:id/comment", isAuthenticate, addComments);
postRoute.get("/comment/:id", isAuthenticate, getCommentsOfPosts);
postRoute.delete("/delete/:id", isAuthenticate, deletepost);
postRoute.get("/bookmark/:id", isAuthenticate, bookmarkPost);

export default postRoute;
