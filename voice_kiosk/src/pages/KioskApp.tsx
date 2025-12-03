// src/pages/KioskApp.tsx
import { useEffect, useState } from "react";
import { useKioskSocket } from "@/hooks/useKioskSocket";
import { useMicStream } from "@/hooks/useMicStream";
import { useKioskStore } from "@/store/kioskStore";
import MainContent from "@/components/main/MainContent";
import Idle from "@/components/Idle";

export default function KioskApp() {
  const storeId = import.meta.env.VITE_KIOSK_STORE_ID;
  const [isStarted, setIsStarted] = useState(false);

  // kiosk store
  const step = useKioskStore((s) => s.step);
  const setStep = useKioskStore((s) => s.setStep);

  // WebSocket & Mic
  const { wsRef, serverReady } = useKioskSocket(storeId, isStarted);
  const { startStreaming, stopStreaming } = useMicStream(wsRef);

  // 화면 터치 → 시작
  const handleTouch = () => {
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  // 마이크 스트리밍 + 초기 단계 설정
  useEffect(() => {
    if (serverReady) {
      console.log("SERVER_READY → start mic");
      startStreaming();

      if (
        step !== "MENU_SELECTION" &&
        step !== "CART_CONFIRMATION" &&
        step !== "PAYMENT_CONFIRMATION" &&
        step !== "COMPLETED" &&
        step !== "CANCELLED"
      ) {
        setStep("MENU_SELECTION");
      }
    }

    return () => {
      if (isStarted) {
        stopStreaming();
      }
    };
  }, [serverReady, isStarted, step, startStreaming, stopStreaming, setStep]);

  // 상태 기반 화면 렌더링
  const renderScreen = () => {
    if (!isStarted || !serverReady) {
      return (
        <Idle
          isStarted={isStarted}
          serverReady={serverReady}
          handleTouch={handleTouch}
        />
      );
    }

    return <MainContent />;
  };

  return (
    <div
      className="w-[1080px] h-[1920px] overflow-hidden"
      onClick={handleTouch}
    >
      {renderScreen()}
    </div>
  );
}
