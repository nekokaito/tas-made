import { create } from "zustand";

type UIState = {
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  checkScreen: () => void;
};

const MOBILE_BREAKPOINT = 768;

export const useUIStore = create<UIState>((set) => ({
  isMobile: false,

  setIsMobile: (value) => set({ isMobile: value }),

  checkScreen: () => {
    if (typeof window === "undefined") return;

    set({
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    });
  },
}));
