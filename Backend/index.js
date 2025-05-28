import express from "express";
import cors from 'cors';
import dotenv  from "dotenv";
import connetDb from "./db/connectDb.js";
import userRoute from "./routers/userRoute.js";
import cookieParser from "cookie-parser";
import postRoute from "./routers/postRoute.js";
import messageRoute from "./routers/messageRoute.js";
import { app,server } from "./socket/socketio.js";

dotenv.config(); 

// const app = express();
app.use(cookieParser());

const port = process.env.PORT; 
const dbUrl = process.env.DBURL; 
const dbName = process.env.DBNAME; 

app.use(express.json());

const corsOption = {
    origin: "http://localhost:5173",
    credentials: true 
};

app.use(cors(corsOption));

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

connetDb(dbUrl,dbName);

server.listen(port, () => {
    console.log(`server started at port no ${port}`);
});
