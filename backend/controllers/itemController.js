import itemModel from "../model/itemModel.js";
import fs from "node:fs";
import PDFDocument from "pdfkit";
// create
const createItem = async (req, res) => {
  let imageFilename = req.file ? req.file.filename : null;

  try {
    const {
      name,
      category,
      brand,
      basePrice,
      color,
      weight,
      size,
      material,
      durability,
    } = req.body;

    // Validate required fields
    if (!name || !imageFilename || !category || !brand || !basePrice) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Parse specifications if provided
    const specifications = {
      color: JSON.parse(color || "[]"),
      weight: JSON.parse(weight || "[]"),
      size: JSON.parse(size || "[]"),
      material: JSON.parse(material || "[]"),
      durability: JSON.parse(durability || "[]"),
    };

    // Create a new item
    const item = new itemModel({
      name,
      image: imageFilename,
      category,
      brand,
      basePrice,
      specifications,
      review: [],
    });

    // Save item to database
    await item.save();
    res.json({ success: true, message: "Item added successfully", item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating item" });
  }
};

// Update ---------------------------------------------------------------------------------------
const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from URL parameters
    const {
      name,
      category,
      brand,
      basePrice,
      color,
      weight,
      size,
      material,
      durability,
    } = req.body; // Get updated data from request body

    // Check if a new image file is provided
    let newImage = req.file ? req.file.filename : null;

    // Find the item by ID
    const item = await itemModel.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // If a new image is provided and the item already has an image, delete the old one
    if (newImage && item.image) {
      fs.unlinkSync(`./Uploads/${item.image}`); // Remove the previous image file
    }

    // Function to safely parse a value or return the existing value
    const parseSpecification = (value, existingValue) => {
      if (value && Array.isArray(value)) {
        return value; // If it's already an array, return as is
      }
      try {
        return value ? JSON.parse(value) : existingValue; // Otherwise, try to parse the value
      } catch (error) {
        console.error("Error parsing specification:", error);
        return existingValue; // If parsing fails, return the existing value
      }
    };

    // Only update specifications if values are provided
    const specifications = {
      color: parseSpecification(color, item.specifications.color),
      weight: parseSpecification(weight, item.specifications.weight),
      size: parseSpecification(size, item.specifications.size),
      material: parseSpecification(material, item.specifications.material),
      durability: parseSpecification(
        durability,
        item.specifications.durability
      ),
    };

    // Update the item in the database
    const updatedItem = await itemModel.findByIdAndUpdate(
      id,
      {
        name,
        image: newImage || item.image, // Use the new image or keep the old image if no new one is provided
        category,
        brand,
        basePrice,
        specifications, // Update specifications with values and prices
      },
      { new: true } // Return the updated item
    );

    // Respond with the updated item
    res.json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating item" });
  }
};

// delete ---------------------------------------------------------------------------------------
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemModel.findById(id);

    fs.unlink(`./Uploads/${item.image}`, (error) => {
      if (error) {
        throw error;
      }
    });

    // Validate ID
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Find and delete item
    const deletedItem = await itemModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting item" });
  }
};

// read
const listItem = async (req, res) => {
  try {
    // Fetch all items from the database
    const items = await itemModel.find();

    // Check if there are any items
    if (items.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No items found" });
    }

    // Return the list of items
    res.json({
      success: true,
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching items" });
  }
};

// get item by id
const getItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from URL parameters

    // Validate ID
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Find the item by ID
    const item = await itemModel.findById(id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Return the found item
    res.json({
      success: true,
      message: "Item retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching item" });
  }
};

const generateReport = async (req, res) => {
  console.log("Generating item report...");

  try {
    const items = await itemModel.find();

    const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=item-report.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Admin Item Report", { align: "center" });
    doc.moveDown(1);

    items.forEach((item, index) => {
      doc
        .fontSize(14)
        .text(`${index + 1}. ${item.name}`, { underline: true })
        .moveDown(0.2);

      doc.fontSize(12);
      doc.text(`Category: ${item.category}`);
      doc.text(`Brand: ${item.brand}`);
      doc.text(`Base Price: LKR ${item.basePrice}`);
      doc.moveDown(0.5);

      // Specifications
      const spec = item.specifications;

      const printSpec = (label, values) => {
        if (values?.length > 0) {
          doc.text(`${label}:`);
          values.forEach((v) => {
            doc.text(` - ${v.value} (LKR ${v.price})`, { indent: 20 });
          });
          doc.moveDown(0.3);
        }
      };

      printSpec("Colors", spec.color);
      printSpec("Weight", spec.weight);
      printSpec("Size", spec.size);
      printSpec("Material", spec.material);
      printSpec("Durability", spec.durability);

      doc.moveDown(1);
      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke();
      doc.moveDown(1);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating item report:", error);
    res
      .status(500)
      .json({ success: false, message: "Error generating item report" });
  }
};

export {
  createItem,
  updateItem,
  deleteItem,
  listItem,
  getItem,
  generateReport,
};
