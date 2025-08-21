import mongoose from "mongoose";
import { boolean } from "zod";

const MessageSchema = new mongoose.Schema({
 senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 recieverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
 text:{
    type:String,
 },
 image:{
    type:String,
 },
 seen:{
    type:Boolean,
    default:false
 },
 
},{timestamps:true});


export const Message =  mongoose.model("Message",MessageSchema);