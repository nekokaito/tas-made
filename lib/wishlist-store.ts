import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistStore = {
  favoriteIds: number[];
  toggleFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
};

export const selectWishlistCount = (state: WishlistStore) =>
  state.favoriteIds.length;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      favoriteIds: [],

      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds.filter((id) => id !== productId)
            : [...state.favoriteIds, productId],
        })),

      removeFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        })),
    }),
    {
      name: "tas-made-wishlist",
      version: 1,

      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          throw new Error("Browser storage is unavailable");
        }

        return window.localStorage;
      }),

      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),

      skipHydration: true,
    },
  ),
);
