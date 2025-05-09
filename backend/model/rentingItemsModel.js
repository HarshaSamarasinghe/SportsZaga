import mongoose from "mongoose";

const RentingItemsModel = new mongoose.Schema(
	{
		eqName: {
			type: String,
			required: true,
		},
		eqDescription: {
			type: String,
			required: true,
		},
		eqPrice: {
			type: Number,
			required: true,
		},
		eqImage: {
			type: String,
			required: true,
		},
		eqAvailability: {
			type: String,
			required: true,
		},
		
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

const Product = mongoose.model("RentingItems", RentingItemsModel);

export default Product;
