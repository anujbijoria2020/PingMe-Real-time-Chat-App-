import express from 'express';
import { checkAuth, updateProfile, UserLogin, UserSignUp } from '../controllers/UserController.js';
import { UserAuth } from '../MiddleWares/UserAuth.js';
const userRouter = express.Router();

userRouter.post("/signup",UserSignUp)
userRouter.post("/login",UserLogin);
userRouter.put("/update-profile",UserAuth,updateProfile);
userRouter.get("/check",UserAuth,checkAuth);

export default userRouter;