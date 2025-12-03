// src/utils/handleMessage.ts
import { useKioskStore } from "@/store/kioskStore";
import type { KioskMessage } from "@/types/messageType";

// 이전 메시지 추적용
let lastMessageType: string | null = null;

export default function handleMessage(msg: KioskMessage) {
  const { setStep, setCart, setText, appendText } = useKioskStore.getState();

  switch (msg.messageType) {
    case "CHANGE_STATE":
      // 상태는 바꾸되 문구는 그대로 유지
      setStep(msg.content.to);

      // 완료 상태일 때만 특별 문구 출력
      if (msg.content.to === "COMPLETED") {
        setCart({ menus: [], menuCount: 0, totalPrice: 0 });
        setText("결제가 완료되었습니다. 이용해주셔서 감사합니다! ☕️");
      }

      if (msg.content.to === "CANCELLED") {
        setCart({ menus: [], menuCount: 0, totalPrice: 0 });
        setText("주문이 취소되었습니다. 처음부터 다시 시도해주세요.");
      }
      break;

    case "UPDATE_SHOPPING_CART":
      setCart({
        menus: msg.content.menus,
        menuCount: msg.content.menuCount,
        totalPrice: msg.content.totalPrice,
      });
      break;

    case "OUTPUT_TEXT_CHUNK":
      // 이전 메시지가 다른 타입이었다면 (새 문장 시작)
      if (lastMessageType !== "OUTPUT_TEXT_CHUNK" && lastMessageType !== "OUTPUT_TEXT_RESULT") {
        setText(""); // 기존 문구 삭제
        setText(msg.content.text); // 새 문장으로 시작
      } else {
        appendText(msg.content.text); // 계속 이어붙이기
      }
      break;

    case "OUTPUT_TEXT_RESULT":
      // 완성 문장일 땐 교체
      setText(msg.content.text);
      break;
  }

  lastMessageType = msg.messageType;
}
