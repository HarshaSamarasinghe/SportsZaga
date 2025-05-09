import express, { Router } from "express";
import multer from "multer";
import {
  createItem,
  updateItem,
  deleteItem,
  listItem,
  getItem,
  generateReport,
} from "../controllers/itemController.js";

const itemRoute = Router();

const storage = multer.diskStorage({
  destination: "./Uploads",
  filename: (request, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// create
itemRoute.post("/create", upload.single("image"), createItem);
// update
itemRoute.put("/update/:id", upload.single("image"), updateItem);
// delete
itemRoute.post("/delete/:id", deleteItem);
// list
itemRoute.get("/list", listItem);
// get item by id
itemRoute.get("/item/:id", getItem);
// generate Reports
itemRoute.post("/reports", generateReport);

export default itemRoute;
