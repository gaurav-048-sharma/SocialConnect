import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ });
import cookieParser from "cookie-parser"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import {app, server} from './socket/socket.js'

import path from 'path';

import connectDb from "./utils/connectDb.js"



const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOptions));


//api request
app.use("/api/v1/user", userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})


server.listen(PORT, (req, res) => {
    connectDb();
    console.log(`Server listen on http://localhost:${PORT}`);
    
})