import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { createChannel, getUserChannels, getChannelMessages } from '../controllers/ChannelsController.js';


const ChannelRoutes = Router()

ChannelRoutes.post("/create-channel", verifyToken, createChannel);
ChannelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
ChannelRoutes.get("/get-channel-messages/:id", verifyToken, getChannelMessages);

export default ChannelRoutes;