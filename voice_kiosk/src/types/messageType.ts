//src/types/messageType.ts
import type { State, State as state } from "@/types/step"; 
import type { Event as event } from "@/types/step"; 

// 1) 메시지 타입 정의
export type MessageType =
  | "UPDATE_SHOPPING_CART"
  | "OUTPUT_TEXT_CHUNK"
  | "OUTPUT_TEXT_RESULT"
  | "CHANGE_STATE"
  | "SERVER_READY";

// 텍스트 메세지

export interface SERVEREADYMESSAGE {
  messageType: "SERVER_READY";
  content: {
    state: State;
  };
}
export interface TextMessage {
  messageType: MessageType;
  content: object;
}

// 메뉴 옵션 타입
export type MenuOption = {
  id: number;
  name: string;
  price: number;
  createdAt: string;
}

// 메뉴 타입
export type Menu = {
  id: number;
  name: string;
  price: number;
  options: MenuOption[];
  createdAt: string;
}

// UPDATE_SHOPPING_CART 메시지 타입
export type UpdateShoppingCartMessage = {
  messageType: "UPDATE_SHOPPING_CART";
  content: {
    menus: Menu[]; // 장바구니 메뉴 목록
    menuCount: number; // 총 메뉴 개수
    totalPrice: number; // 총 주문 금액
  };
};

// OUTPUT_TEXT_CHUNK 메시지 타입
export type OutputTextChunkMessage = {
  messageType: "OUTPUT_TEXT_CHUNK";
  content: {
    text: string;
  };
};

// OUTPUT_TEXT_RESULT 메시지 타입
export type OutputTextResultMessage = {
  messageType: "OUTPUT_TEXT_RESULT";
  content: {
    text: string;
  };
};

// CHANGE_STATE 메시지 타입
export type ChangeStateMessage = {
  messageType: "CHANGE_STATE";
  content: {
    from: state;
    to: state;
    because: event;
  };
};

export type KioskMessage =
  | OutputTextChunkMessage
  | OutputTextResultMessage
  | ChangeStateMessage
  | UpdateShoppingCartMessage;
