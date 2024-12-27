import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({ });
import cookieParser from "cookie-parser"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
const PORT = process.env.PORT || 3000;
const app = express();
import connectDb from "./utils/connectDb.js"
app.get("/", (req, res) =>{
    return res.status(200).json({
        message: "Hello, World!",
        success: true
    })
})

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


app.listen(PORT, (req, res) => {
    connectDb();
    console.log(`Server listen on http://localhost:${PORT}`);
    
})