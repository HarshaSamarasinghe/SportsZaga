import express from "express";
import {
  createRentingOrder,
  getOrders,
  updateReturnRequest,
  fetchAllOrders,
  generateReport,
} from "../Controllers/rentingOrderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// save a renting order Details
router.post("/", authMiddleware, createRentingOrder);
// get specific renting order details
router.get("/", authMiddleware, getOrders);

// get all renting order details
router.get("/list", fetchAllOrders);

// update a Order Status
router.put("/:id", updateReturnRequest);

//Generate Renting Reports
router.post("/generate-renting-report", generateReport);

export default router;
