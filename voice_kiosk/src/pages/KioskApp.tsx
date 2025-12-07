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
  const step = useKioskStore((s) => s.step);
  const setStep = useKioskStore((s) => s.setStep);
  const setText = useKioskStore((s) => s.setText);

  const { wsRef, serverReady } = useKioskSocket(storeId, isStarted);
  const { startStreaming, stopStreaming } = useMicStream(wsRef);

  // 화면 터치 → 시작
  const handleTouch = () => {
    if (!isStarted) setIsStarted(true);
  };

  // 서버 준비 완료 → 음성 입력 시작
  useEffect(() => {
    if (serverReady) {
      startStreaming();

      if (step === "CANCELLED" || step === "COMPLETED") return;
      setStep("MENU_SELECTION");
    }
  }, [serverReady]);

  // 🟢 COMPLETED → 3초 뒤 Idle 화면으로 자동 이동
  useEffect(() => {
    if (step === "COMPLETED") {
      setText("✅ 결제가 완료되었습니다.");

      const timer = setTimeout(() => {
        console.log("🔄 COMPLETED → Idle 화면으로 복귀");
        setIsStarted(false);
        setStep("MENU_SELECTION");
        setText("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // 🔥 isStarted = false → WebSocket + Mic 모두 정리
  useEffect(() => {
    if (!isStarted) {
      console.log("🛑 Idle 상태 → WebSocket 및 마이크 종료");

      wsRef.current?.close(1000, "Go back to idle");
      stopStreaming();
    }
  }, [isStarted]);

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
