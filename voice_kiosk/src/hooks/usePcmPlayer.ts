import { useRef } from "react";

/**
 * 서버로부터 수신한 Linear PCM(16bit, 24kHz)을 재생하는 훅
 */
export default function usePcmPlayer() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const queueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  /**
   * AudioContext 활성화 (터치 이벤트 내에서 호출)
   */
  const activate = () => {
    if (!audioCtxRef.current) {
      // Safari 호환
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx({ sampleRate: 24000 });
      console.log("🎧 AudioContext 생성됨 (24kHz)");
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      console.log("▶️ AudioContext resumed");
    }
  };

  /**
   * PCM 데이터를 큐에 추가 후 재생
   */
  const enqueue = (pcmData: ArrayBuffer) => {
    queueRef.current.push(pcmData);
    if (!isPlayingRef.current) {
      playNext();
    }
  };

  /**
   * 큐에 있는 PCM 데이터 순차 재생
   */
  const playNext = () => {
    const ctx = audioCtxRef.current;
    if (!ctx || isPlayingRef.current) return;

    const buffer = queueRef.current.shift();
    if (!buffer) return;

    isPlayingRef.current = true;

    try {
      const floatData = pcm16ToFloat32(buffer);
      const audioBuffer = ctx.createBuffer(1, floatData.length, 24000);
      audioBuffer.copyToChannel(floatData, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      source.onended = () => {
        isPlayingRef.current = false;
        playNext();
      };

      source.start();
      console.log("🔊 PCM 재생 시작:", floatData.length, "samples");
    } catch (err) {
      console.error("❌ PCM 재생 실패:", err);
      isPlayingRef.current = false;
      playNext();
    }
  };

  /**
   * AudioContext 및 큐 정리
   */
  const stop = () => {
    isPlayingRef.current = false;
    queueRef.current = [];

    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      console.log("🛑 AudioContext closed");
      audioCtxRef.current = null;
    }
  };

  return { activate, enqueue, stop };
}

/**
 * PCM 16-bit Little Endian → Float32 변환
 */
function pcm16ToFloat32(buffer: ArrayBuffer) {
  const dataView = new DataView(buffer);
  const length = dataView.byteLength / 2;
  const result = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    result[i] = int16 / 0x8000;
  }

  return result;
}
