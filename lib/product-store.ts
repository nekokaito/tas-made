import { ProductStore } from "@/types/product";
import { create } from "zustand";

export const useProductStore = create<ProductStore>((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}));
