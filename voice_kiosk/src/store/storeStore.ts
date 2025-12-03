// src/store/storeStore.ts
import { create } from "zustand";

interface StoreState {
  storeId: string | null;
  setStoreId: (id: string) => void;
  clearStore: () => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  storeId: localStorage.getItem("storeId"),
  setStoreId: (id) => {
    localStorage.setItem("storeId", id);
    set({ storeId: id });
  },
  clearStore: () => {
    localStorage.removeItem("storeId");
    set({ storeId: null });
  },
}));
