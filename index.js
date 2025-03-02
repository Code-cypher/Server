import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRouter from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const database_url = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN ? process.env.ORIGIN.split(",") : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Static files (Consider using Azure Blob Storage instead of local storage)
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/contacts", contactsRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Initialize WebSockets
setupSocket(server);

// MongoDB Connection
mongoose.connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { 
    console.log("Database connected successfully"); 
}).catch((err) => { 
    console.error("MongoDB Connection Error:", err.message);
});
