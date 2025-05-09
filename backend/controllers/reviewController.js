import itemModel from "../model/itemModel.js";
import reviewModel from "../model/reviewModel.js";
import PDFDocument from "pdfkit";

// Add Review
const addReview = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;
  const { rating, reviewText } = req.body;

  try {
    const review = new reviewModel({
      cusID: userId,
      itemID: itemId,
      rating,
      reviewText,
    });

    const newReview = await review.save();

    const updatedItem = await itemModel.findByIdAndUpdate(
      itemId,
      {
        $push: { review: newReview._id },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Review
const updateReview = async (req, res) => {
  const { reviewID } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewID,
      {
        rating,
        reviewText,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  const { reviewID, itemID } = req.params;
  const cusID = req.user.id;

  const reviewIdStr = reviewID.toString();
  const itemIdStr = itemID.toString();
  const cusIdStr = cusID.toString();

  try {
    const deletedReview = await reviewModel.findOneAndDelete({
      _id: reviewIdStr,
      cusID: cusIdStr,
      itemID: itemIdStr,
    });

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Remove the review from the Item's reviews array
    await itemModel.findByIdAndUpdate(
      itemID,
      {
        $pull: { review: reviewID }, // Remove review from the item
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// List Reviews for Item
const listReviews = async (req, res) => {
  const cusID = req.user.id;
  const { itemID } = req.params;

  try {
    const item = await itemModel
      .findById(itemID)
      .populate("review")
      .sort({ "review.createdAt": -1 }); // Populate reviews with review data

    const filteredReviews = item.review.filter(
      (review) => review.cusID.toString() !== cusID
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews: filteredReviews, // Return the reviews array
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const myReviews = async (req, res) => {
  try {
    const { itemID } = req.params;
    const cusID = req.user.id;

    if (!itemID) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Ensure itemID and cusID are treated as strings (since schema uses `type: String`)
    const reviews = await reviewModel
      .find({ itemID, cusID }) // Get reviews for specific item and customer
      .sort({ createdAt: -1 }); // Sort by latest first

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ success: true, message: "No reviews found", reviews: [] });
    }

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Reviews (Admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All reviews retrieved successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const generateReport = async (req, res) => {
  console.log("Generating report...");
  const { startDate, endDate } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const reviews = await reviewModel.find({
      createdAt: { $gte: start, $lte: end },
    });

    //const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=review-report-${startDate}-to-${endDate}.pdf`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Review Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Period: ${startDate} to ${endDate}`, { align: "center" });
    doc.moveDown(1.5);

    // Column positions
    const tableTop = 130;
    const colX = {
      id: 40,
      customer: 140,
      item: 260,
      rating: 360,
      review: 430,
    };

    // Headers
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Review ID", colX.id, tableTop);
    doc.text("Customer ID", colX.customer, tableTop);
    doc.text("Item ID", colX.item, tableTop);
    doc.text("Rating", colX.rating, tableTop);
    doc.text("Review Text", colX.review, tableTop, { width: 330 });

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(800, tableTop + 15)
      .stroke(); // underline

    // Table rows
    doc.font("Helvetica").fontSize(9);
    let y = tableTop + 25;

    reviews.forEach((review) => {
      if (y > 550) {
        doc.addPage({ size: "A4", layout: "landscape", margin: 40 });
        y = 50;
      }

      doc.text(review?._id?.toString() || "-", colX.id, y, {
        width: colX.customer - colX.id - 5,
      });
      doc.text(review?.cusID?.toString() || "-", colX.customer, y, {
        width: colX.item - colX.customer - 5,
      });
      doc.text(review?.itemID?.toString() || "-", colX.item, y, {
        width: colX.rating - colX.item - 5,
      });
      doc.text(review?.rating?.toString() || "-", colX.rating, y, {
        width: colX.review - colX.rating - 5,
      });
      doc.text(review?.reviewText?.toString() || "-", colX.review, y, {
        width: 330,
      });

      y += 20;
    });

    // Summary
    doc.moveDown(2);
    doc
      .fontSize(12)
      .text(`Total Reviews: ${reviews.length}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
};

export {
  addReview,
  updateReview,
  deleteReview,
  listReviews,
  myReviews,
  generateReport,
  getAllReviews,
};
