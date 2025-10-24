import { create } from "zustand";

type UIState = {
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  checkScreen: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),
  checkScreen: () => {
    const isMobile = window.innerWidth < 768;
    set({ isMobile });
  },
}));
