import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;

/**
 * Get or initialize FFmpeg singleton instance
 */
async function getFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  try {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  } catch (err) {
    console.warn('FFmpeg load failed or Cross-Origin Isolation not enabled, falling back to Web Audio API', err);
    throw err;
  }
}

/**
 * Resamples an AudioBuffer to 16000 Hz Mono Float32Array using OfflineAudioContext
 */
async function resampleTo16kMono(audioBuffer: AudioBuffer): Promise<Float32Array> {
  const targetSampleRate = 16000;
  const numChannels = 1;
  const duration = audioBuffer.duration;
  const targetLength = Math.max(1, Math.round(duration * targetSampleRate));

  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    numChannels,
    targetLength,
    targetSampleRate
  );

  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.connect(offlineCtx.destination);
  bufferSource.start(0);

  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer.getChannelData(0);
}

/**
 * Extract 16kHz mono Float32Array PCM audio using native Web Audio API (instant & universal)
 */
async function extractWithWebAudio(fileOrBlob: Blob | File): Promise<Float32Array> {
  const arrayBuffer = await fileOrBlob.arrayBuffer();
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    // decodeAudioData consumes the buffer, so pass a clone
    const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    return await resampleTo16kMono(decodedBuffer);
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Extract 16kHz mono Float32Array PCM audio using FFmpeg.wasm
 */
async function extractWithFFmpeg(
  fileOrBlob: Blob | File,
  onProgress?: (progress: number) => void
): Promise<Float32Array> {
  const ffmpeg = await getFFmpeg(onProgress);
  const inputFileName = 'input_' + Date.now();
  const outputFileName = 'output_' + Date.now() + '.wav';

  const data = await fetchFile(fileOrBlob);
  await ffmpeg.writeFile(inputFileName, data);

  // Demux and transcode to 16kHz 1-channel 16-bit PCM WAV
  await ffmpeg.exec([
    '-i', inputFileName,
    '-vn', // disable video
    '-ar', '16000', // 16kHz
    '-ac', '1', // mono
    '-f', 'wav',
    outputFileName
  ]);

  const outputData = await ffmpeg.readFile(outputFileName);
  
  // Clean up virtual files
  await ffmpeg.deleteFile(inputFileName).catch(() => {});
  await ffmpeg.deleteFile(outputFileName).catch(() => {});

  // Decode WAV buffer with Web Audio API
  const wavBlob = new Blob([outputData as Uint8Array], { type: 'audio/wav' });
  return await extractWithWebAudio(wavBlob);
}

/**
 * Main audio extraction entry point:
 * Tries Web Audio API first for instant decoding; if unsupported codec/container, falls back to FFmpeg.wasm!
 */
export async function extract16kHzAudio(
  fileOrBlob: Blob | File,
  onStatus?: (stage: 'native' | 'ffmpeg', progress?: number) => void
): Promise<Float32Array> {
  try {
    onStatus?.('native', 20);
    // Fast path: Web Audio API (Zero WASM download overhead)
    const pcm = await extractWithWebAudio(fileOrBlob);
    onStatus?.('native', 100);
    return pcm;
  } catch (webAudioErr) {
    console.info('Native WebAudio decoding unavailable for this container/codec. Utilizing FFmpeg.wasm...', webAudioErr);
    onStatus?.('ffmpeg', 10);
    
    // Fallback: FFmpeg.wasm
    const pcm = await extractWithFFmpeg(fileOrBlob, (progress) => {
      onStatus?.('ffmpeg', progress);
    });
    return pcm;
  }
}
