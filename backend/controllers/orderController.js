import orderModel from "../model/orderModel.js";
import customizeModel from "../model/customizeModel.js";

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customizedId, shippingDetails, amount, payment } = req.body;
    const userId = req.user.id;

    if (!customizedId || !shippingDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      customizedId,
      shippingDetails,
      amount,
      payment,
    });

    await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// Get all orders for the logged-in user
const listOrder = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (using token data)
    const userId = req.user.id;

    // Fetch orders for the specific user from the database
    const orders = await orderModel.find({ userId: userId });

    // Using Promise.all to fetch customization details for each order in parallel
    const ordersWithCustomization = await Promise.all(
      orders.map(async (order) => {
        // If the order has a customizedId, fetch the customization details
        if (order.customizedId) {
          try {
            // Fetch the customization details using customizedId
            const customization = await customizeModel.findById(
              order.customizedId
            );

            return {
              ...order.toObject(), // Spread the order details into the response
              customizedDetails: customization || null, // Add customization details or null if not found
            };
          } catch (err) {
            console.error(
              `Error fetching customization for order ${order._id}:`,
              err
            );
            return { ...order.toObject(), customizedDetails: null }; // Return order without customization on error
          }
        }

        // If no customization exists, return the order without customization
        return { ...order.toObject(), customizedDetails: null };
      })
    );

    // Send the response with the orders and their corresponding customization details
    return res.status(200).json({
      success: true,
      data: ordersWithCustomization, // This will include both order and customization details
      message: "Successfully fetched the order list with customization details",
    });
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error for debugging purposes
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// Fetch all paid orders
const fetchAllOrders = async (req, res) => {
  try {
    // Fetching all orders that have a successful payment
    const successfulOrders = await orderModel
      .find({ payment: true }) // Only fetching orders with a payment status of true
      .sort({ createdAt: -1 }) // Sorting by the most recent first
      .exec();

    // Using Promise.all to fetch customization details for each order in parallel
    const ordersWithCustomization = await Promise.all(
      successfulOrders.map(async (order) => {
        // If the order has a customizedId, fetch the customization details
        if (order.customizedId) {
          try {
            // Fetch the customization details using customizedId
            const customization = await customizeModel.findById(
              order.customizedId
            );

            return {
              ...order.toObject(), // Spread the order details into the response
              customizedDetails: customization || null, // Add customized details to the response, or null if not found
            };
          } catch (err) {
            console.error(
              `Error fetching customization for order ${order._id}:`,
              err
            );
            return { ...order.toObject(), customizedDetails: null }; // Return order without customization on error
          }
        }

        // If no customization exists, return the order without customization
        return { ...order.toObject(), customizedDetails: null };
      })
    );

    console.log("Orders with customization:", ordersWithCustomization); // Debugging log

    // Send the response with the orders and their corresponding customization details
    return res.status(200).json({
      success: true,
      data: ordersWithCustomization, // This will include both order and customization details
      message: "Successfully fetched the order list with customization details",
    });
  } catch (error) {
    console.error("Error fetching all orders:", error); // Log the error for debugging purposes
    return res.status(500).json({
      success: false,
      message: "Internal server error", // Return a 500 status code on error
    });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

// delete user's order
const deleteMyOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID
    const { orderId } = req.params; // Order ID from request

    // Find the order and ensure it belongs to the authenticated user
    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found or unauthorized" });
    }

    // Delete the order
    await orderModel.findByIdAndDelete(orderId);

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Error deleting order" });
  }
};

// Update the tracking information of an order (e.g., tracking number or status)
const updateOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tracking } = req.body; // Tracking info (could be a tracking number or status)

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.tracking = tracking; // Update the tracking info
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order tracking information updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order tracking:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating order tracking" });
  }
};

// Update the payment status of an order
const updateOrderPaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { payment } = req.body; // boolean

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.payment = payment;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order payment status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the payment status",
    });
  }
};

export {
  createOrder,
  listOrder,
  deleteMyOrder,
  fetchAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderTracking,
  updateOrderPaymentStatus,
};
