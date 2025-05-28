import express from "express";
import isAuthenticate from "../middelwears/isAuthenticated.js";
import {sendMessage, getMessage } from "../controller/messageController.js";

const messageRoute=express.Router();


messageRoute.post("/send/:id",isAuthenticate,sendMessage)
messageRoute.get("/all/:id",isAuthenticate,getMessage)







export default messageRoute;