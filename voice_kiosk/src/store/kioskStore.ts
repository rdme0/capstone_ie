//src/store/kioskStore.ts
import { create } from "zustand";
import type { Menu } from "@/types/messageType";
import type { State as KioskStep } from "@/types/step";

interface CartState {
  menus: Menu[];
  menuCount: number;
  totalPrice: number;
}

interface KioskState {
  step: KioskStep;
  text: string;
  cart: CartState;

  setStep: (step: KioskStep) => void;
  setText: (text: string) => void;
  appendText: (chunk: string) => void;
  setCart: (cart: CartState) => void;
}

export const useKioskStore = create<KioskState>((set) => ({
  step: "MENU_SELECTION",
  text: "",
  cart: {
    menus: [],
    menuCount: 0,
    totalPrice: 0,
  },

  setStep: (step) => set({ step }),
  setText: (text) => set({ text }),
  appendText: (chunk) => set((state) => ({ text: state.text + chunk })),
  setCart: (cart) => set({ cart }),
}));
