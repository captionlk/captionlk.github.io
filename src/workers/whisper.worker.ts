import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js environment for browser worker
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber: any = null;
let currentModel: string = '';

interface WorkerMessageData {
  type: 'load' | 'transcribe' | 'ping';
  model?: string;
  audio?: Float32Array;
  language?: string;
  task?: 'transcribe' | 'translate';
}

self.onmessage = async (event: MessageEvent<WorkerMessageData>) => {
  const { type, model = 'onnx-community/whisper-tiny', audio, language = 'si', task = 'transcribe' } = event.data;

  if (type === 'ping') {
    self.postMessage({ type: 'pong' });
    return;
  }

  if (type === 'load') {
    try {
      if (transcriber && currentModel === model) {
        self.postMessage({ type: 'model_ready', model });
        return;
      }

      self.postMessage({ type: 'status', status: 'loading_model', message: `Initializing Whisper AI model (${model})...` });

      // Determine WebGPU capability safely
      let device = 'wasm';
      try {
        if ('gpu' in navigator && (navigator as any).gpu) {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) {
            device = 'webgpu';
          }
        }
      } catch {
        device = 'wasm';
      }

      self.postMessage({ type: 'device_info', device });

      transcriber = await pipeline('automatic-speech-recognition', model, {
        device: device as any,
        dtype: device === 'webgpu' ? 'fp32' : 'q8',
        progress_callback: (progress: any) => {
          self.postMessage({
            type: 'download_progress',
            data: progress
          });
        }
      });

      currentModel = model;
      self.postMessage({ type: 'model_ready', model, device });
    } catch (err: any) {
      console.error('Error loading Whisper model in worker:', err);
      self.postMessage({
        type: 'error',
        error: err.message || 'Failed to load Whisper model. Trying WASM fallback...'
      });

      // Try pure WASM fallback if WebGPU failed
      try {
        transcriber = await pipeline('automatic-speech-recognition', model, {
          device: 'wasm',
          dtype: 'q8',
          progress_callback: (progress: any) => {
            self.postMessage({
              type: 'download_progress',
              data: progress
            });
          }
        });
        currentModel = model;
        self.postMessage({ type: 'model_ready', model, device: 'wasm' });
      } catch (fallbackErr: any) {
        self.postMessage({
          type: 'error',
          error: `Model load error: ${fallbackErr.message || 'Unknown error'}`
        });
      }
    }
    return;
  }

  if (type === 'transcribe') {
    if (!audio) {
      self.postMessage({ type: 'error', error: 'No audio data provided' });
      return;
    }

    try {
      if (!transcriber || currentModel !== model) {
        self.postMessage({ type: 'status', status: 'loading_model', message: `Loading ${model}...` });
        transcriber = await pipeline('automatic-speech-recognition', model, {
          device: 'wasm',
          progress_callback: (progress: any) => {
            self.postMessage({ type: 'download_progress', data: progress });
          }
        });
        currentModel = model;
      }

      self.postMessage({ type: 'status', status: 'transcribing', message: 'Transcribing speech to Sinhala...' });

      const options: any = {
        chunk_length_s: 30,
        stride_length_s: 5,
        task: task,
        return_timestamps: true,
        force_full_sequences: false
      };

      if (language && language !== 'auto') {
        options.language = language;
      }

      const output = await transcriber(audio, options);

      self.postMessage({
        type: 'transcribe_complete',
        result: output
      });
    } catch (err: any) {
      console.error('Inference error in worker:', err);
      self.postMessage({
        type: 'error',
        error: err.message || 'Error occurred during speech recognition inference'
      });
    }
  }
};
