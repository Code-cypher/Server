import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getMessages, } from '../controllers/MessagesController.js';
import { uploadFile } from "../controllers/MessagesController.js"
import multer from "multer"

const messagesRoutes = Router();

const multer = multer({ dest: "uploads/files" })
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, multer.single("file"), uploadFile);

export default messagesRoutes;