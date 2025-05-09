import { Router } from "express";
import {
  createOrder,
  listOrder,
  deleteMyOrder,
  fetchAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderTracking,
  updateOrderPaymentStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const orderRoute = Router();

orderRoute.post("/create", authMiddleware, createOrder); // //frontend - when user buy item
orderRoute.put("/update/:orderId", updateOrderPaymentStatus); //frontend - when user buy item
orderRoute.get("/my-orders", authMiddleware, listOrder); //user
orderRoute.post("/my-orders/delete/:orderId", authMiddleware, deleteMyOrder); //user
orderRoute.get("/list", fetchAllOrders); //admin
orderRoute.get("/get-order/:orderId", getOrderById); //admin
orderRoute.post("/delete-order/:orderId", deleteOrder); //admin
orderRoute.put("/tracking/:orderId", updateOrderTracking); // admin

export default orderRoute;
