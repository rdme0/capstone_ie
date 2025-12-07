// src/hooks/usePcmPlayer.ts
import { useRef } from "react";

export default function usePcmPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef(0);

  const ensureContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
  };

  const enqueue = (arrayBuffer: ArrayBuffer) => {
    ensureContext();
    const ctx = audioContextRef.current!;

    const pcm = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(pcm.length);

    for (let i = 0; i < pcm.length; i++) {
      float32[i] = pcm[i] / 32768;
    }

    const audioBuf = ctx.createBuffer(1, float32.length, 24000);
    audioBuf.getChannelData(0).set(float32);

    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    src.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, lastPlayTimeRef.current - 0.02);

    src.start(startAt);

    lastPlayTimeRef.current = startAt + audioBuf.duration;
  };

  const stop = () => {
    audioContextRef.current?.close();
    audioContextRef.current = null;
    lastPlayTimeRef.current = 0;
  };

  return { enqueue, stop };
}
