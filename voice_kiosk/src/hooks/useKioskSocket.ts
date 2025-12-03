import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useKioskStore } from "@/store/kioskStore";
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
    };

    ws.onerror = (e) => console.error("⚠️ WebSocket error:", e);

    ws.onclose = (e) => console.log("❌ WebSocket closed:", e.code, e.reason);

    ws.onmessage = (event) => {
      const data = event.data;

      // PCM 오디오
      if (data instanceof ArrayBuffer) {
        pcmPlayer.enqueue(data);
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
            if (firstChunkRef.current) {
              setText(""); // 기존 텍스트 삭제
              firstChunkRef.current = false;
            }
            appendText(json.content.text);
            break;

          case "OUTPUT_TEXT_RESULT":
            setTimeout(() => {
              setText(json.content.text);
            }, 0);
            break;


          case "UPDATE_SHOPPING_CART":
            setCart(json.content);
            break;

          case "CHANGE_STATE":
            setStep(json.content.to);
            firstChunkRef.current = true;
            break;
        }
      } catch (err) {
        console.error("❌ JSON 파싱 실패:", err);
      }
    };

  
    return () => {
      console.log("🔌 WebSocket cleanup");
      ws.close(1000, "Client closed");
      pcmPlayer.stop();
    };
  }, [connect]); 

  // 🔥 COMPLETED → 소켓 종료
  useEffect(() => {
    if (step === "COMPLETED") {
      wsRef.current?.close(1000, "Payment complete");
      pcmPlayer.stop();
      setText("✅ 결제가 완료되었습니다.");
    }
  }, [step]);

  return { wsRef, serverReady, pcmPlayer };
};
