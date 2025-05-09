import mongoose, { Schema } from "mongoose";

const customizeSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true }, // Selected item name
    image: { type: String, required: true }, // Selected item image
    color: { type: String }, // Selected color
    weight: { type: String }, // Selected weight
    size: { type: String }, // Selected size
    material: { type: String }, // Selected material
    durability: { type: String }, // Selected durability
    totalPrice: { type: Number, required: true }, // Final price after customization
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const customizeModel =
  mongoose.models.customize || mongoose.model("customize", customizeSchema);

export default customizeModel;
