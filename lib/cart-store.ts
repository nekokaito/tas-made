import { create } from "zustand";
import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  changeQuantity: (productId: number, amount: number) => void;
  removeItem: (productId: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      return {
        items: existing
          ? state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...state.items, { product, quantity: 1 }],
      };
    }),
  changeQuantity: (productId, amount) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
}));
