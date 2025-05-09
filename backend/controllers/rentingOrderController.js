import mongoose from "mongoose";
import rentCusOrderDetails from "../Model/rentingOrderDetailsModel.js";
import PDFDocument from "pdfkit";

export const createRentingOrder = async (req, res) => {
  try {
    const {
      cusName,
      eqID,
      cusEmail,
      cusPhone,
      cusAddress,
      cusTown,
      cusPostalCode,
      TotalPrice,
      shippingMethod,
      rentFrom,
      rentTo,
    } = req.body;

    if (
      !cusName ||
      !cusEmail ||
      !cusPhone ||
      !cusAddress ||
      !cusTown ||
      !cusPostalCode ||
      !TotalPrice ||
      !shippingMethod ||
      !rentFrom ||
      !rentTo
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const userId = req.user.id;

    const newOrder = new rentCusOrderDetails({
      cusName,
      userId,
      eqID,
      cusEmail,
      cusPhone,
      cusAddress,
      cusTown,
      cusPostalCode,
      TotalPrice,
      shippingMethod,
      rentFrom,
      rentTo,
    });

    await newOrder.save();

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Error placing renting order:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// Get all orders for the logged-in user
export const getOrders = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (using token data)
    const userId = req.user.id;

    // Fetch orders for the specific user from the database

    const orders = await rentCusOrderDetails
      .find({ userId: userId })
      .populate("eqID");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// Get all orders for admin
export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await rentCusOrderDetails.find({}).populate("eqID");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log("error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateReturnRequest = async (req, res) => {
  const { id } = req.params;

  const order = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Order Id" });
  }

  try {
    const updatedReturnRequest = await rentCusOrderDetails.findByIdAndUpdate(
      id,
      order,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedReturnRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const generateReport = async (req, res) => {
  console.log("Generating report...");
  const { startDate, endDate } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // const orders = await rentCusOrderDetails.find({
    //   createdAt: { $gte: start, $lte: end }
    // });
    const orders = await rentCusOrderDetails
      .find({ createdAt: { $gte: start, $lte: end } })
      .populate("eqID");

    // Create A4 landscape document
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=renting-report-${startDate}-to-${endDate}.pdf`
    );

    doc.pipe(res);

    // Title and period
    doc.fontSize(18).text("Renting Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Period: ${startDate} to ${endDate}`, { align: "center" });
    doc.moveDown(1.5);

    // Adjusted column x-positions for landscape layout
    const tableTop = 130;
    const colX = {
      name: 40,
      ref: 140,
      price: 240,
      returned: 320,
      from: 410,
      due: 500,
      status: 590,
      fine: 680,
    };

    // Headers
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("EQUIPMENT NAME", colX.name, tableTop);
    doc.text("REF NUMBER", colX.ref, tableTop);
    doc.text("PRICE PAID", colX.price, tableTop);
    doc.text("RETURNED DATE", colX.returned, tableTop);
    doc.text("RENTED FROM", colX.from, tableTop);
    doc.text("DUE DATE", colX.due, tableTop);
    doc.text("STATUS", colX.status, tableTop);
    doc.text("FINE", colX.fine, tableTop);

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(800, tableTop + 15)
      .stroke(); // underline

    // Table rows
    doc.font("Helvetica").fontSize(9);
    let y = tableTop + 25;

    const dateFormat = (date) =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));

    orders.forEach((order) => {
      if (y > 550) {
        // lower height for landscape
        doc.addPage({ size: "A4", layout: "landscape", margin: 40 });
        y = 50;
      }

      doc.text(order?.eqID?.eqName || "-", colX.name, y, {
        width: colX.ref - colX.name - 5,
      });
      doc.text(order?._id?.toString().slice(-6) || "-", colX.ref, y, {
        width: colX.price - colX.ref - 5,
      });
      doc.text(`Rs.${order?.TotalPrice || 0}`, colX.price, y);
      doc.text(dateFormat(order?.returnDate), colX.returned, y);
      doc.text(dateFormat(order?.rentFrom), colX.from, y);
      doc.text(dateFormat(order?.rentTo), colX.due, y);
      doc.text(order?.returnStatus || "-", colX.status, y);
      doc.text(`Rs.${order?.fineValue || 0}`, colX.fine, y);

      y += 20;
    });

    // Summary
    doc.moveDown(2);
    const totalPrice = orders.reduce(
      (sum, order) => sum + (order?.TotalPrice || 0),
      0
    );
    doc.fontSize(12).text(`Total Orders: ${orders.length}`, { align: "right" });
    doc.text(`Total Amount: Rs.${totalPrice.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating report" });
  }
};
