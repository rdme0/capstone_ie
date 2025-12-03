import { useState } from "react";
import { useKioskSocket } from "@/hooks/useKioskSocket";
import { useMicStream } from "@/hooks/useMicStream";
import { useStoreStore } from "@/store/storeStore"; 

export default function StreamStarter() {
  const storeId = useStoreStore((s) => s.storeId); 
  const [connected, setConnected] = useState(false); 

  // ✅ null 대응
  const { wsRef, serverReady } = useKioskSocket(storeId ?? "", connected);
  const { startStreaming } = useMicStream(wsRef);

  const handleStart = () => {
    if (!connected) {
      setConnected(true);
      console.log("🔗 WebSocket 연결 요청됨");
      return;
    }

    if (serverReady) {
      startStreaming();
    }
  };

  return (
    <button
      className="w-full h-full bg-yellow-300 text-4xl"
      onClick={handleStart}
      disabled={!storeId}
    >
      {!storeId && "❗ 관리자 인증 후 실행해 주세요"}
      {!connected && storeId && "👉 터치하면 연결됩니다"}
      {connected && !serverReady && "⏳ 서버 준비 중..."}
      {connected && serverReady && "🎤 음성 입력 시작"}
    </button>
  );
}
