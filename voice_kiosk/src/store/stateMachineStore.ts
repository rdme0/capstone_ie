// src/store/stateMachineStore.ts
import { create } from "zustand";
import type { State, Event } from "@/types/step";

interface StateMachine {
  currentState: State;
  transition: (event: Event) => void;
}

export const useStateMachine = create<StateMachine>((set) => ({
  currentState: "MENU_SELECTION",

  transition: (event) =>
    set((state) => {
      const s = state.currentState;

      switch (s) {
        case "MENU_SELECTION":
          if (event === "CONFIRM_PAYMENT") return { currentState: "PAYMENT_CONFIRMATION" };
          if (event === "CANCEL") return { currentState: "CANCELLED" };
          break;

        case "PAYMENT_CONFIRMATION":
          if (event === "PREVIOUS") return { currentState: "MENU_SELECTION" };
          if (event === "PROCESS_PAYMENT") return { currentState: "COMPLETED" };
          if (event === "CANCEL") return { currentState: "CANCELLED" };
          break;

        case "COMPLETED":
        case "CANCELLED":
          return state; // 그대로 유지
      }

      return state;
    }),
}));
