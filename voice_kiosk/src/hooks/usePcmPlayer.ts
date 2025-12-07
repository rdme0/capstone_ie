// src/hooks/usePcmPlayer.ts
import { useRef } from "react";

export default function usePcmPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef(0); // 마지막 재생이 끝나는 시간

  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({
        sampleRate: 24000
      });
    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  const convertToFloat32 = (buffer: ArrayBuffer) => {
    const dataView = new DataView(buffer);
    const float32 = new Float32Array(buffer.byteLength / 2);

    for (let i = 0; i < float32.length; i++) {
      float32[i] = dataView.getInt16(i * 2, true) / 0x8000;
    }
    return float32;
  };

  const enqueue = (buffer: ArrayBuffer) => {
    ensureAudioContext();

    const audioCtx = audioContextRef.current!;
    const pcm = convertToFloat32(buffer);

    // Float32 → AudioBuffer
    const audioBuffer = audioCtx.createBuffer(1, pcm.length, 24000);
    audioBuffer.getChannelData(0).set(pcm);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    // 💡 핵심! 재생 타임라인 안정화
    const now = audioCtx.currentTime;

    // 오디오가 제때 도착 안 해도 부드럽게 이어지도록
    const startAt = Math.max(lastPlayTimeRef.current, now);

    source.start(startAt);

    // 다음 재생 시간 갱신
    lastPlayTimeRef.current = startAt + audioBuffer.duration;
  };

  const stop = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      lastPlayTimeRef.current = 0;
    }
  };

  return { enqueue, stop };
}