import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "user",
      required: true,
    },
    customizedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customize",
      required: true,
    },
    shippingDetails: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    tracking: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
