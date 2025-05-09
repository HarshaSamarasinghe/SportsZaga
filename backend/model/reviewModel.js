import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    cusID: {
      type: String,
      required: true,
    },
    itemID: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const reviewModel =
  mongoose.model.review || mongoose.model("review", reviewSchema);
export default reviewModel;
