import express, { Router } from "express";
import {
  createRepair,
  updateRepair,
  deleteRepair,
  listRepairItems,
  getRepairItem,
  listUserRepairs,
  listAllRepairs,
  adminUpdateRepair,
  generateReport,
} from "../controllers/repairController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const repairRoute = Router();

repairRoute.post("/create", authMiddleware, createRepair);

repairRoute.put("/update/:id", authMiddleware, updateRepair);

repairRoute.put("/update/my/:id", adminUpdateRepair); //admin

repairRoute.post("/delete/:id", deleteRepair);

repairRoute.get("/list", listRepairItems);

repairRoute.get("/get/:id", getRepairItem);

repairRoute.get("/my", authMiddleware, listUserRepairs);

repairRoute.get("/get/list", listAllRepairs);

repairRoute.post("/generate-report", generateReport);

export default repairRoute;
