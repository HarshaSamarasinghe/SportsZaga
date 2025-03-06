import express from "express";
import cors from "cors";
import { log } from "console";
import connectDB from "./Config/db.js";
import "dotenv/config.js";

// App Config
const server = express();
const PORT = 4000;

// Middleware
server.use(express.json());
server.use(cors());

// All Routes
server.use("/images", express.static("./Uploads"));

// DB Connection
connectDB();

server.get("/", (c, s) => {
  s.send("API WORKING");
});

server.listen(PORT, () => log(`Server is running on http://localhost:${PORT}`));
