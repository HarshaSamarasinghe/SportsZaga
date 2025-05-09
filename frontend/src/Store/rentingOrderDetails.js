import { create } from "zustand";
import axios from "axios";

export const useOrderDetails = create((set) => ({
  orders: [],

  setOrderDetails: (orders) => set({ orders }),

  createOrderDetails: async (newOrderDetails) => {
    if (
      !newOrderDetails.cusName ||
      !newOrderDetails.cusEmail ||
      !newOrderDetails.cusPhone ||
      !newOrderDetails.cusAddress ||
      !newOrderDetails.cusTown ||
      !newOrderDetails.cusPostalCode ||
      !newOrderDetails.shippingMethod ||
      !newOrderDetails.rentFrom ||
      !newOrderDetails.rentTo
    ) {
      return { success: false, message: "Please fill in all fields." };
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/RentingOrderDetails",
        newOrderDetails
      );
      set((state) => ({ orders: [...state.orders, res.data.data] }));
      return { success: true, message: "Order created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create order.",
      };
    }
  },

  getAllOrders: async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/RentingOrderDetails/list"
      );
      return res.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; // Ensures state does not break
    }
  },

  updateReturnStatus: async (pid, updatedReturnStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/RentingOrderDetails/${pid}`,
        updatedReturnStatus
      );
      if (!res.data.success)
        return { success: false, message: res.data.message };

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === pid ? res.data.data : order
        ),
      }));

      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update return status.",
      };
    }
  },
}));
