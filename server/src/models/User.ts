import mongoose, { mongo } from "mongoose";
import { minLength, required } from "zod/v4-mini";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },
  bio: { type: String },
},{timestamps:true});


export const User =  mongoose.model("User",UserSchema);