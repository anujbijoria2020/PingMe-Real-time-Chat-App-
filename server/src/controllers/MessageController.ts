import { success } from "zod";
import { Message } from "../models/message.js";
import { User } from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, UserSocketMap } from "../index.js";

export const getUsersForSideBar = async(req:any,res:any)=>{
    try{
const userId  = req.user._id;

const  filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");

//counting not seen msgs
const unseenMessages:Record<string,number>  = {};

    const promises = filteredUsers.map(async(user:any)=>{
const  messages = await Message.find({senderId:user._id ,recieverId:userId,seen:false});
if(messages.length>0){
    unseenMessages[user._id.toString()] = messages.length;
}
    });

    await Promise.all(promises);
res.json({
    message:"fetched users and unseen messages for every user",
    filteredUsers:filteredUsers,
    unseenMessages:unseenMessages,
    success:true
})
    }catch(error:any){
console.log(error.message);
res.status(500).json({
    message:error.message,
    success:true,
})
    }
}


export const getMessages = async (req:any,res:any) =>{
    try{
   const{id:selectedUserId} = req.params;
   const myId = req.user._id;

const messages = await Message.find({
  $or: [{ senderId: myId, recieverId: selectedUserId }, { senderId: selectedUserId, recieverId: myId }]
}).sort({ createdAt: 1 });

   await Message.updateMany({senderId:selectedUserId,recieverId:myId},{seen:true});

   res.status(200).json({
    message:"fetched messages successfully",
    messages:messages,
    success:true,
   })
    }
    catch(error:any){
console.log(error.message);
res.status(500).json({
message:"failed in getting messages",
success:false
})
    }
}

export const markMessageAsSeen = async(req:any,res:any)=>{
try{
    const {id} = req.params;
await Message.findByIdAndUpdate(id,{seen:true});
res.status(200).json({
    message:"marked seen successfully",
    success:true,
})
}
catch(error:any){
    console.log(error.message);
res.status(500).json({
message:"failed in getting messages",
success:false
})
}
}

export const sendMessage = async(req:any,res:any)=>{
try{
    const{text,image} = req.body;
    const recieverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse =await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
    const newMessage =await Message.create({
        senderId,
        recieverId,
        text,
        image:imageUrl
    })

    //emitting the messages to recivers socket
    const recieverSocketId = UserSocketMap[recieverId];
    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessage);
    }
    const senderSocketId = UserSocketMap[senderId];
if (senderSocketId) {
  io.to(senderSocketId).emit("newMessage", newMessage);
}

    res.status(200).json({
        message:"message send successFully",
        newMessage:newMessage,
        success:true,
    });
    
}catch(error:any){
    console.log(error.message);
    res.status(500).json({
        message:error.message,
        success:false
    })
}
}