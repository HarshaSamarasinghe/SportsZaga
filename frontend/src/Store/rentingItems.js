import axios from "axios";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (
      !newProduct.eqName ||
      !newProduct.eqDescription ||
      !newProduct.eqPrice ||
      !newProduct.eqImage ||
      !newProduct.eqAvailability
    ) {
      return { success: false, message: "Please fill in all fields." };
    }
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/rentingItems",
        newProduct
      );
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({ products: [...state.products, data.data] }));
      return { success: true, message: "Equipment created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },

  fetchProducts: async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/rentingItems"
      );
      if (!data.success) return;
      set((state) => ({ products: data.data }));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },

  deleteProduct: async (pid) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/rentingItems/${pid}`
      );
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        products: state.products.filter((product) => product._id !== pid),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },

  updateProduct: async (pid, updatedProduct) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/rentingItems/${pid}`,
        updatedProduct
      );
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        products: state.products.map((product) =>
          product._id === pid ? data.data : product
        ),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred",
      };
    }
  },
}));
