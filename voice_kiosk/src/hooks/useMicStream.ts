// src/hooks/useMicStream.ts
import { useEffect, useRef } from "react";

export const useMicStream = (
  wsRef: React.MutableRefObject<WebSocket | null>
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // 🎤 마이크 권한 요청
  const initMicPermission = async () => {
    if (!mediaStreamRef.current) {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("🎙️ 마이크 권한 허용됨");
    }
  };

  // 🔁 WebSocket이 OPEN 될 때까지 기다리는 유틸
  const waitForSocketOpen = (socket: WebSocket): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const handleOpen = () => {
        cleanup();
        console.log("🟢 WebSocket OPEN 확인 후 마이크 시작");
        resolve();
      };

      const handleError = (e: Event) => {
        cleanup();
        console.error("🚨 WebSocket 열리는 중 에러:", e);
        reject(e);
      };

      const cleanup = () => {
        socket.removeEventListener("open", handleOpen);
        socket.removeEventListener("error", handleError);
      };

      socket.addEventListener("open", handleOpen);
      socket.addEventListener("error", handleError);
    });
  };

  // 🎧 오디오 스트리밍 시작
  const startStreaming = async () => {
    const socket = wsRef.current;

    if (!socket) {
      console.warn("⚠️ WebSocket 인스턴스가 없습니다.");
      return;
    }

    try {
      // 1) 마이크 권한 먼저 확보
      await initMicPermission();

      // 2) WebSocket OPEN 될 때까지 기다리기
      await waitForSocketOpen(socket);
    } catch (e) {
      console.error("🎙️ 마이크 스트리밍 시작 실패:", e);
      return;
    }

    if (!mediaStreamRef.current) {
      console.warn("⚠️ mediaStream이 없습니다.");
      return;
    }

    console.log("🎙️ Audio streaming started");

    // 기존 AudioContext가 살아있으면 정리
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.close();
    }

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(mediaStreamRef.current);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      const input = e.inputBuffer.getChannelData(0); // Float32Array (44100Hz)
      const downsampled = downsampleBuffer(
        input,
        audioContext.sampleRate,
        24000
      );
      const pcm = floatTo16BitPCM(downsampled);

      ws.send(pcm);
    };

    processorRef.current = processor;
    sourceRef.current = source;
  };

  // 🛑 스트리밍 중지 및 정리
  const stopStreaming = () => {
    console.log("🛑 Audio streaming stopped");

    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  };

  // 🎚️ 다운샘플링 (44.1kHz → 24kHz)
  function downsampleBuffer(
    buffer: Float32Array,
    inputRate: number,
    targetRate: number
  ) {
    if (targetRate === inputRate) return buffer;
    const sampleRateRatio = inputRate / targetRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  // 🔊 Float32 → 16bit PCM 변환
  function floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  // cleanup 자동 처리
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  return { startStreaming, stopStreaming, initMicPermission };
};
