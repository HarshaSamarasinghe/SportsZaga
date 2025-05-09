import { Router } from "express";
import {
  createCustomization,
  listCustomizations,
  deleteCustomization,
  updateCustomizationProgress,
  myCustomizations,
  updateCustomization,
  generateReport,
} from "../controllers/customizeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const customizeRoute = Router();

// create
customizeRoute.post("/create", authMiddleware, createCustomization);
// list
customizeRoute.get("/list", listCustomizations);
// my customizations
customizeRoute.get("/my", authMiddleware, myCustomizations);
// Delete
customizeRoute.delete("/delete/:id", deleteCustomization);
// Update Progress
customizeRoute.put("/update/:id", updateCustomizationProgress);
// update customization - user
customizeRoute.put("/update/my/:id", authMiddleware, updateCustomization);
//Generate Customized Reports
customizeRoute.get("/report", generateReport);

export default customizeRoute;
