//src/types/step.ts

export type State =
  | "CART_CONFIRMATION" // 장바구니 확인
  | "PAYMENT_CONFIRMATION" // 결제 확인
  | "MENU_SELECTION" // 메뉴 선택
  | "CANCELLED" // 취소
  | "COMPLETED"; // 완료

export type Event =
  | "CANCEL" // 취소
  | "PREVIOUS" // 이전
  | "PROCESS_PAYMENT" // 결제 처리
  | "CONFIRM_CART" // 장바구니 확인
  | "CONFIRM_PAYMENT"; // 결제 확인
