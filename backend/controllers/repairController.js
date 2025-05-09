import repairModel from "../model/repairModel.js";
import PDFDocument from "pdfkit";

//create
const createRepair = async (req, res) => {
  const { name, equipment, description } = req.body;
  const userId = req.user.id;

  const repair = new repairModel({
    userId: userId,
    name: name,
    equipment: equipment,
    description: description,
    //progress:progress,
    //price:price,
    //status:status
  });
  try {
    await repair.save();
    res.json({ success: true, message: "Repair Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//update
const updateRepair = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { name, equipment, description, progress, price, status } = req.body;
  try {
    const updateRepair = await repairModel.findOneAndUpdate(
      { _id: id, userId },
      { name, equipment, description, progress, price, status },
      { new: true }
    );
    if (!updateRepair) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Review updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in updating review" });
  }
};

const adminUpdateRepair = async (req, res) => {
  const { id } = req.params;
  const { name, equipment, description, progress, price, status } = req.body;
  try {
    const updateRepair = await repairModel.findOneAndUpdate(
      { _id: id },
      { name, equipment, description, progress, price, status },
      { new: true }
    );
    if (!updateRepair) {
      return res
        .status(404)
        .json({ success: false, message: "Repair not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Repair updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in updating Repair" });
  }
};

//Delete
const deleteRepair = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRepair = await repairModel.findOneAndDelete({ _id: id });
    res.json({ success: true, message: "Repair deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Repair deleted Unsuccessfully" });
  }
};

//read
const listRepairItems = async (req, res) => {
  try {
    const repairs = await repairModel.find({});
    res.json({
      success: true,
      message: "Data fetched successfully",
      data: repairs,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Data fetched Unsuccessfully" });
  }
};

//get repair by id
const getRepairItem = async (req, res) => {
  const { id } = req.params;

  try {
    const repair = await repairModel.findById(id);

    if (!repair) {
      return res.json({ success: false, message: "Repair not found" });
    }
    return res.json({ success: true, data: repair });
  } catch (error) {
    return res.json({ success: false, message: "Error fetching repair" });
  }
};

// Fetch Repairs for a Specific User
const listUserRepairs = async (req, res) => {
  const userId = req.user.id;
  try {
    const repairs = await repairModel.find({ userId: userId });
    console.log(repairs);
    res.json({ success: true, message: "User Repairs Fetched", data: repairs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error Fetching Repairs" });
  }
};

// Fetch All Repairs (Admin View)
const listAllRepairs = async (req, res) => {
  try {
    const repairs = await repairModel.find();
    res.json({ success: true, message: "All Repairs Fetched", data: repairs });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error Fetching Repairs" });
  }
};

// Generate Report
const generateReport = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const repairs = await repairModel.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=repair-report-${startDate}-to-${endDate}.pdf`
    );

    doc.pipe(res);

    // Title & Period
    doc.fontSize(20).text("Repair Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`, {
      align: "center",
    });
    doc.moveDown(1);

    // Table Headers
    const tableTop = 130;
    const rowHeight = 24;

    const columnWidths = {
      name: 80,
      equipment: 90,
      description: 130,
      progress: 60,
      price: 60,
      status: 70,
    };

    let x = 40;
    const headers = [
      { label: "Name", key: "name", width: columnWidths.name },
      { label: "Equipment", key: "equipment", width: columnWidths.equipment },
      {
        label: "Description",
        key: "description",
        width: columnWidths.description,
      },
      { label: "Progress", key: "progress", width: columnWidths.progress },
      { label: "Price", key: "price", width: columnWidths.price },
      { label: "Status", key: "status", width: columnWidths.status },
    ];

    doc.fontSize(11).font("Helvetica-Bold");

    headers.forEach(({ label, width }) => {
      doc.text(label, x, tableTop, { width, align: "left" });
      x += width;
    });

    // Table Body
    let y = tableTop + rowHeight;
    doc.font("Helvetica").fontSize(10);

    repairs.forEach((repair) => {
      x = 40;

      headers.forEach(({ key, width }) => {
        let value = repair[key];

        if (key === "progress") value = `${repair.progress}%`;
        if (key === "price") value = `Rs.${repair.price}`;

        doc.text(String(value), x, y, { width, align: "left" });
        x += width;
      });

      y += rowHeight;

      // Auto page break
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = tableTop;
      }
    });

    // Summary Section (LEFT-aligned)
    doc.moveDown(2);
    const totalRepairs = repairs.length;
    const totalPrice = repairs.reduce((sum, r) => sum + r.price, 0);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Total Repairs: ${totalRepairs}`, {
        align: "left",
      });

    doc.font("Helvetica-Bold").text(`Total Price: Rs.${totalPrice}`, {
      align: "left",
    });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Error generating report",
    });
  }
};

export {
  createRepair,
  updateRepair,
  deleteRepair,
  listRepairItems,
  getRepairItem,
  listUserRepairs,
  listAllRepairs,
  adminUpdateRepair,
  generateReport,
};
