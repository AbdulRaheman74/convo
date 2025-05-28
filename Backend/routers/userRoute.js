import express from "express";
import { editProfile, followOrUnfollow, getProfile, login, logout, register, suggestedUsers } from "../controller/userController.js";
import isAuthenticate from "../middelwears/isAuthenticated.js";
import upload from "../middelwears/multer.js";

const userRoute=express.Router();


userRoute.post("/register",register);
userRoute.post("/login",login);
userRoute.get("/logout",logout);
userRoute.get("/profile/:id",isAuthenticate,getProfile);
userRoute.post("/profile/edit",isAuthenticate,upload.single('profilePicture'),editProfile);
userRoute.get("/suggested",isAuthenticate,suggestedUsers);
userRoute.post("/followorunfolloew/:id",isAuthenticate,followOrUnfollow);







export default userRoute;