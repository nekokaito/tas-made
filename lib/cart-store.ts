import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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

export const selectCartItemCount = (state: CartStore) =>
  state.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore) =>
  state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id,
          );

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
    }),
    {
      name: "tas-made-bag",
      version: 1,

      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          throw new Error("Browser storage is unavailable");
        }

        return window.localStorage;
      }),

      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);
