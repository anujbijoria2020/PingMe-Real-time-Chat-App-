import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {createServer} from 'http';
import {Server} from 'socket.io';
import mongoose from "mongoose";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

const app = express();
const server = createServer(app);

//intialising socket.io server
export const io =new Server(server,{
    cors:{
        origin:"*"
    }
});


mongoose.connect(`${process.env.MONGO_URL}/PingMe`).then(()=>{
    console.log("mongodb connected successfully");
}).catch((err)=>{
    console.log("db connection failed",err);
})

//storing online users {userId:socketId}
export const UserSocketMap:any = {}; 

io.on("connection",(socket)=>{
    let  userId = socket.handshake.query.userId;
    userId = Array.isArray(userId)?userId[0]:userId;
console.log("user connected",userId);

if(userId) UserSocketMap[userId] = socket.id;

io.emit("getOnlineUsers",Object.keys(UserSocketMap));

socket.on("disconnect",()=>{
    console.log("User disconnected",userId);
    delete UserSocketMap[userId!];
    io.emit("getOnlineUsers",Object.keys(UserSocketMap));
})
})


app.use(express.json({limit:"4mb"}));
app.use(cors());

app.use("/api.status",(req,res)=>{
    res.send({
        message:"server is live"
    }) 
}
)
app.use("/api/v1/auth",userRouter);
app.use("/api/v1/message",messageRouter);

const PORT  = process.env.PORT || 3000;
server.listen(PORT,()=>{
console.log(`server is running on port ${PORT}`);
});
