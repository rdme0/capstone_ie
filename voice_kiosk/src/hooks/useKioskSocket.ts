// src/hooks/useKioskSocket.ts
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useKioskStore } from "@/store/kioskStore";
import type { State } from "@/types/step";
import usePcmPlayer from "@/hooks/usePcmPlayer";

export const useKioskSocket = (storeId: string, connect: boolean) => {
  const wsRef = useRef<WebSocket | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [serverReady, setServerReady] = useState(false);

  const setCart = useKioskStore((s) => s.setCart);
  const setText = useKioskStore((s) => s.setText);
  const appendText = useKioskStore((s) => s.appendText);
  const setStep = useKioskStore((s) => s.setStep);
  const step = useKioskStore((s) => s.step);

  const firstChunkRef = useRef(true);
  const pcmPlayer = usePcmPlayer();

  // COMPLETED 상태 여부 (PCM 차단)
  const isCompletedRef = useRef(false);

  useEffect(() => {
    if (!connect || !storeId || !accessToken) return;

    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/stores/${storeId}/websocket/kioskSession?accessToken=${encodeURIComponent(
      accessToken
    )}`;

    console.log("🔌 WebSocket 연결 시도:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      firstChunkRef.current = true;
      isCompletedRef.current = false;
    };

    ws.onerror = (e) => console.error("⚠️ WebSocket error:", e);
    ws.onclose = (e) => console.log("❌ WebSocket closed:", e.code, e.reason);

    ws.onmessage = (event) => {
      const data = event.data;

      if (data instanceof ArrayBuffer) {
        if (!isCompletedRef.current) {
          pcmPlayer.enqueue(data);
        }
        return;
      }

      try {
        const json = JSON.parse(data);
        console.log("📩 메시지 수신:", json);

        switch (json.messageType) {
          case "SERVER_READY":
            setServerReady(true);
            break;

          case "OUTPUT_TEXT_CHUNK":
            if (!isCompletedRef.current) {
              if (firstChunkRef.current) {
                setText("");
                firstChunkRef.current = false;
              }
              appendText(json.content.text);
            }
            break;

          case "OUTPUT_TEXT_RESULT":
            if (!isCompletedRef.current) {
              setText(json.content.text);
            }
            break;

          case "UPDATE_SHOPPING_CART":
            setCart(json.content);
            break;

          case "CHANGE_STATE": {
            const next = json.content.to as State;
            const prev = step;
            console.log(`🔄 상태 변경: ${prev} → ${next}`);

            setStep(next);
            firstChunkRef.current = true;

            if (next === "PAYMENT_CONFIRMATION") {
              console.log("💳 PAYMENT_CONFIRMATION 도달 → PROCESS_PAYMENT 자동 전송");

              const payMsg = {
                messageType: "PROCESS_PAYMENT",
                content: { paymentMethod: "AUTO" },
              };

              wsRef.current?.send(JSON.stringify(payMsg));
            }

            if (next === "COMPLETED") {
              console.log("🎉 COMPLETED 진입 → PCM 차단 + 종료 준비");

              isCompletedRef.current = true;

              setText("🧾 주문해주셔서 감사합니다.");

              setTimeout(() => {
                wsRef.current?.close(1000, "Payment complete");
                pcmPlayer.stop();
              }, 200);
            }

            break;
          }

          default:
            console.warn("⚠️ Unknown messageType:", json.messageType);
        }
      } catch (err) {
        console.error("❌ JSON parse error:", err);
      }
    };

    return () => {
      console.log("🔌 WebSocket cleanup");
      ws.close(1000, "Client closed");
      pcmPlayer.stop();
    };
  }, [connect]);

  return { wsRef, serverReady, pcmPlayer };
};
