import mongoose from "mongoose";
import Product from "../Model/rentingItemsModel.js";

 // Get all products
export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createProduct = async (req, res) => {

	const eqImage = req.file ? req.file.filename : null;

	// const product = req.body; // user will send this data


	//const newProduct = new Product(product);

	try {
		const {
			eqName,
			eqDescription,
			eqPrice,
			eqAvailability,

		} = req.body;

		if (!eqName || !eqDescription ||!eqPrice || !eqImage || !eqAvailability) {
			return res.status(400).json({ success: false, message: "Please provide all fields!! (Backend)" });
		}

		const newProduct = new Product({
			eqName,
			eqImage,
			eqDescription,
			eqPrice,
			eqAvailability,
		});

		await newProduct.save();
		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error("Error in Create product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// export const updateProduct = async (req, res) => {
// 	const { id } = req.params;

// 	const product = req.body;

// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ success: false, message: "Invalid Product Id" });
// 	}

// 	try {
// 		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
// 		res.status(200).json({ success: true, data: updatedProduct });
// 	} catch (error) {
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

// export const deleteProduct = async (req, res) => {
// 	const { id } = req.params;

// 	if (!mongoose.Types.ObjectId.isValid(id)) {
// 		return res.status(404).json({ success: false, message: "Invalid Product Id" });
// 	}

// 	try {
// 		await Product.findByIdAndDelete(id);
// 		res.status(200).json({ success: true, message: "Product deleted" });
// 	} catch (error) {
// 		console.log("error in deleting product:", error.message);
// 		res.status(500).json({ success: false, message: "Server Error" });
// 	}
// };

// Update a product
export const updateProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ success: false, message: "Invalid Product ID" });
	}

	try {
		const { eqName, eqDescription, eqPrice, eqAvailability } = req.body;
		let eqImage = req.file ? req.file.filename : null;

		// Find existing product
		const existingProduct = await Product.findById(id);
		if (!existingProduct) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		// Retain existing image if no new image is uploaded
		eqImage = eqImage || existingProduct.eqImage;

		// Update product
		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ eqName, eqImage, eqDescription, eqPrice, eqAvailability },
			{ new: true }
		);

		res.status(200).json({ success: true, data: updatedProduct });

	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Delete a product
export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ success: false, message: "Invalid Product ID" });
	}

	try {
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		res.status(200).json({ success: true, message: "Product deleted successfully" });

	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};