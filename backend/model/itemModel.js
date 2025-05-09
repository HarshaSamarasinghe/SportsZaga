import mongoose, { Schema } from "mongoose";

const specificationSchema = new Schema({
  value: { type: String, required: true },
  price: { type: Number, required: true },
});

const itemSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "Cricket Bat", "Football"
    image: { type: String, required: true }, // store image URL
    category: { type: String, required: true }, // e.g., "Bat", "Ball"
    brand: { type: String, required: true }, // e.g., "Nike", "Adidas"
    basePrice: { type: Number, required: true }, // Base price before customizations
    specifications: {
      color: [specificationSchema], // e.g., [{ value: "Red", price: 5 }]
      weight: [specificationSchema], // e.g., [{ value: "1.2kg", price: 10 }]
      size: [specificationSchema], // e.g., [{ value: "Large", price: 15 }]
      material: [specificationSchema], // e.g., [{ value: "Leather", price: 20 }]
      durability: [specificationSchema], // e.g., [{ value: "High", price: 25 }]
    },
    review: [{ type: Schema.Types.ObjectId, ref: "review" }], // Array of review IDs
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const itemModel = mongoose.models.item || mongoose.model("item", itemSchema);

export default itemModel;
