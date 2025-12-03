// src/store/stateMachineStore.ts
import { create } from "zustand";
import type { State, Event } from "@/types/step";

interface StateMachine {
  currentState: State;
  transition: (event: Event) => void;
}

export const useStateMachine = create<StateMachine>((set) => ({
  currentState: "MENU_SELECTION", // 초기 상태

transition: (event) =>
  set((state) => {
    switch (state.currentState) {
      case "MENU_SELECTION":
        if (event === "CONFIRM_CART") return { currentState: "CART_CONFIRMATION" };
        if (event === "CANCEL") return { currentState: "CANCELLED" };
        break;

      case "CART_CONFIRMATION":
        if (event === "CONFIRM_PAYMENT") return { currentState: "PAYMENT_CONFIRMATION" };
        if (event === "PREVIOUS") return { currentState: "MENU_SELECTION" };
        if (event === "CANCEL") return { currentState: "CANCELLED" };
        break;

      case "PAYMENT_CONFIRMATION":
        if (event === "PROCESS_PAYMENT") return { currentState: "COMPLETED" };
        if (event === "PREVIOUS") return { currentState: "MENU_SELECTION" };
        if (event === "CANCEL") return { currentState: "CANCELLED" };
        break;

      case "COMPLETED":
        // 완료 후 끝남  - 상태 유지
        break;

      case "CANCELLED":
        // 취소 후 끝남  - 상태 유지
        break;
    }
    return state;
  }),
}));
