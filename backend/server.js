import express from "express";
import cors from "cors";
import { log } from "console";
import connectDB from "./Config/db.js";
import "dotenv/config.js";
import itemRoute from "./routes/itemRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import customizeRoute from "./routes/customizeRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import userRoute from "./routes/userRoute.js";
import repairRoute from "./routes/repairRoute.js";
import rentingItemsRoute from "./Routes/rentingItemsRoute.js";
import rentingOrderDetailsRoute from "./Routes/rentingOrderDetailsRoute.js";

// App Config
const server = express();
const PORT = 4000;

// Middleware
server.use(express.json());
// Middleware to parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: true })); // payment
server.use(cors());
server.use("/images", express.static("./Uploads"));

// All Routes
server.use("/payment", paymentRoute); // payment
server.use("/api/items", itemRoute);
server.use("/api/reviews", reviewRoute);
server.use("/api/customize", customizeRoute);
server.use("/api/order", orderRoute);
server.use("/api/user", userRoute);
server.use("/api/repair", repairRoute);
server.use("/api/rentingItems", rentingItemsRoute);
server.use("/api/RentingOrderDetails", rentingOrderDetailsRoute);

// DB Connection
connectDB();

server.get("/", (c, s) => {
  s.send("API WORKING");
});

server.listen(PORT, () => log(`Server is running on http://localhost:${PORT}`));
