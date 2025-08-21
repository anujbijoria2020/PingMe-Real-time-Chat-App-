import type { NextFunction } from "express";
import { User } from "../models/User.js";
import jwt, { type JwtPayload }  from 'jsonwebtoken';
import { success } from "zod";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const UserAuth = async (req:any,res:any,next:NextFunction)=>{
try{
const token = req.headers.token;
const decoded = jwt.verify(token,process.env.JWT_SECRET!) as MyJwtPayload;

const user = await User.findById(decoded.userId).select("-password");

if(!user){
    return res.status(400).json({
        message:"User not found",
        success:false
    })
}

req.user = user;
next();
}
catch(error:any){
console.log(error);
return res.status(400).json({
    message:error.message,
    success:false
})
}
}