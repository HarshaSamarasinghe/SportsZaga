import express, { request } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../Controllers/rentingItemsController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./Uploads",
    filename: (request, file, callback) => {
        return callback(null, `${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage: storage});


// get all products
router.get("/", getProducts);
// create a product
router.post("/create", upload.single("eqImage"), createProduct);
// update a product
router.put("/:id", upload.single("eqImage"), updateProduct);
// delete a product
router.delete("/:id", deleteProduct);

export default router;
