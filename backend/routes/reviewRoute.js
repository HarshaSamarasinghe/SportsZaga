import { Router } from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  listReviews,
  myReviews,
  generateReport,
  getAllReviews,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const reviewRoute = Router();

// Create a new review for an item
reviewRoute.post("/add/:itemId", authMiddleware, addReview); // Add a review to an item

// Update an existing review
reviewRoute.put("/update/:reviewID", updateReview); // Update review by reviewID

// Delete a review from an item
reviewRoute.post("/delete/:reviewID/:itemID", authMiddleware, deleteReview); // Delete review by reviewID and itemID

// List all reviews for an item
reviewRoute.get("/list/:itemID", authMiddleware, listReviews); // List reviews by itemID

reviewRoute.get("/my/:itemID", authMiddleware, myReviews); // List reviews by itemID and user id

// Admin route to get all reviews
reviewRoute.get("/all", getAllReviews); // Get all reviews for admin

// Admin generate reports
reviewRoute.post("/generate-review-report", generateReport);
export default reviewRoute;
