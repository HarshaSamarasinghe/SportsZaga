import customizeModel from "../model/customizeModel.js";
import PDFDocument from "pdfkit";

const createCustomization = async (req, res) => {
  const userId = req.user.id;
  const { name, image, color, weight, size, material, durability, totalPrice } =
    req.body;
  try {
    const newCustomization = new customizeModel({
      userId,
      name,
      image,
      color,
      weight,
      size,
      material,
      durability,
      totalPrice,
    });

    await newCustomization.save();

    res.status(201).json({
      success: true,
      message: "Customization saved successfully",
      data: newCustomization,
    });
  } catch (error) {
    console.error("Error saving customization:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save customization",
      error: error.message,
    });
  }
};

// get customization list
const listCustomizations = async (req, res) => {
  try {
    const customizations = await customizeModel.find();
    res.status(200).json({
      success: true,
      message: "Customizations retrieved successfully",
      data: customizations,
    });
  } catch (error) {
    console.error("Error fetching customizations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customizations",
      error: error.message,
    });
  }
};

const myCustomizations = async (req, res) => {
  const userId = req.user.id;
  try {
    const customizations = await customizeModel.find({ userId: userId });
    res.status(200).json({
      success: true,
      message: "My Customizations retrieved successfully",
      data: customizations,
    });
  } catch (error) {
    console.error("Error fetching my customizations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customizations",
      error: error.message,
    });
  }
};

const deleteCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await customizeModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Customization not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customization deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customization:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete customization",
      error: error.message,
    });
  }
};

// Update customization progress
const updateCustomizationProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body; // Get progress from request body

    const updatedCustomization = await customizeModel.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!updatedCustomization) {
      return res.status(404).json({ message: "Customization not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customization progress updated successfully",
      data: updatedCustomization,
    });
  } catch (error) {
    console.error("Error updating customization progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update customization progress",
      error: error.message,
    });
  }
};

const updateCustomization = async (req, res) => {
  try {
    const { color, weight } = req.body;
    const { id } = req.params;
    const userId = req.user.id;

    const customize = await customizeModel.findById(id);

    if (!customize) {
      return res.status(404).json({ message: "Customization not found" });
    }

    // Only update color and weight
    customize.color = color || customize.color;
    customize.weight = weight || customize.weight;

    await customize.save();

    res
      .status(200)
      .json({ message: "Customization updated successfully", customize });
  } catch (error) {
    console.error("Error updating customization:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const customizations = await customizeModel.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=customization_report_${startDate}_to_${endDate}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Customization Report", { align: "center" })
      .moveDown();
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Report Period: ${startDate} to ${endDate}`, { align: "center" })
      .moveDown(2);

    // Table headers
    const tableTop = 130;
    const tableLeft = 50;
    const rowHeight = 25;
    const colWidths = [100, 80, 70, 80, 100]; // Custom widths

    const headers = ["Name", "Color", "Weight (g)", "Size", "Price (USD)"];

    let x = tableLeft;
    doc.fontSize(10).font("Helvetica-Bold");

    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: "center" });
      x += colWidths[i];
    });

    // Draw horizontal line after headers
    doc
      .moveTo(tableLeft, tableTop + rowHeight - 10)
      .lineTo(x, tableTop + rowHeight - 10)
      .stroke();

    // Table rows
    let y = tableTop + rowHeight;
    doc.font("Helvetica");

    customizations.forEach((item) => {
      let xPos = tableLeft;

      doc.fontSize(9).text(item.name || "-", xPos, y, {
        width: colWidths[0],
        align: "left",
      });
      xPos += colWidths[0];

      doc.text(item.color || "-", xPos, y, {
        width: colWidths[1],
        align: "center",
      });
      xPos += colWidths[1];

      doc.text(item.weight || "-", xPos, y, {
        width: colWidths[2],
        align: "right",
      });
      xPos += colWidths[2];

      doc.text(item.size || "-", xPos, y, {
        width: colWidths[3],
        align: "center",
      });
      xPos += colWidths[3];

      doc.text(`$${item.totalPrice.toFixed(2)}`, xPos, y, {
        width: colWidths[4],
        align: "right",
      });

      y += rowHeight;
    });

    // Add horizontal line above summary
    doc
      .moveTo(tableLeft, y + 10)
      .lineTo(tableLeft + colWidths.reduce((a, b) => a + b), y + 10)
      .stroke();

    // Summary
    const totalRevenue = customizations.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(
        `Total Customizations: ${customizations.length}`,
        tableLeft,
        y + 30
      );
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, tableLeft, y + 55);

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};

export {
  createCustomization,
  listCustomizations,
  deleteCustomization,
  updateCustomizationProgress,
  myCustomizations,
  updateCustomization,
  generateReport,
};
