import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import mongoose from "mongoose";
import AuthRouter from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const database_url = process.env.DATABASE_URL


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieparser())

app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use("/api/contacts", contactsRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(() => {
    console.log(`Server is running at "http://localhost:${port}`)
})

setupSocket(server)

mongoose.connect(database_url).then(() => { console.log("Database connected succesfully") }).catch((err) => { console.log(err.message) })