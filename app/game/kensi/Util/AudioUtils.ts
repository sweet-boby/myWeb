let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  const context = getAudioContext();
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return context.decodeAudioData(arrayBuffer);
}

export function getAudioSource(buffer: AudioBuffer, loop: boolean = false) {
  const context = getAudioContext();
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.loop = loop;
  return source;
}

export function playSound(
  source: AudioBufferSourceNode,
  loop: boolean = false
) {
  source.loop = loop;
  source.start();
}

export function stopSound(source: AudioBufferSourceNode) {
  source.stop();
}

// 关闭音频上下文
export function closeAudioContext() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

export function getAudioUtils() {
  return {
    getAudioSource,
    loadAudioBuffer,
    getAudioContext,
    playSound,
    stopSound,
    closeAudioContext,
  };
}
