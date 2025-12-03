// /src/utils/playAudio.ts
// 서버에서 받은 PCM 음성을 재생하는 유틸
export async function playAudio(pcmData: ArrayBuffer) {
  const ctx = new AudioContext({ sampleRate: 24000 });
  const pcm16 = new Int16Array(pcmData);
  const float32 = new Float32Array(pcm16.length);

  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 0x7fff;
  }

  const buffer = ctx.createBuffer(1, float32.length, 24000);
  buffer.copyToChannel(float32, 0);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  await ctx.resume();
  source.start();
}
