import express from 'express';
import { UserAuth } from '../MiddleWares/UserAuth.js';
import { getMessages, getUsersForSideBar, markMessageAsSeen, sendMessage } from '../controllers/MessageController.js';

const messageRouter= express.Router();

messageRouter.get("/users",UserAuth,getUsersForSideBar);
messageRouter.get("/:id",UserAuth,getMessages);
messageRouter.put("/mark/:id",UserAuth,markMessageAsSeen);
messageRouter.post("/send/:id",UserAuth,sendMessage);

export default messageRouter;