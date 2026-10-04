import type { SubtitleSegment } from './srtParser';

export const DEMO_SUBTITLES_SI: SubtitleSegment[] = [
  {
    id: 'seg-1',
    start: 0.5,
    end: 3.8,
    text: 'ආයුබෝවන්! CaptionLK වෙත ඔබව සාදරයෙන් පිළිගනිමු.'
  },
  {
    id: 'seg-2',
    start: 4.2,
    end: 8.5,
    text: 'මෙය 100% ක්ලයන්ට්-සයිඩ්, බ්‍රවුසරය තුළම ක්‍රියාත්මක වන ප්‍රථම සිංහල AI උපසිරැසි ජනකයයි.'
  },
  {
    id: 'seg-3',
    start: 9.0,
    end: 13.6,
    text: 'ඔබගේ වීඩියෝ කිසිදු සර්වරයකට අප්ලෝඩ් නොවන බැවින් පෞද්ගලිකත්වය උපරිමයෙන් සුරැකේ.'
  },
  {
    id: 'seg-4',
    start: 14.1,
    end: 18.2,
    text: 'ක්ෂණිකව .SRT හෝ .VTT ගොනු බාගත කර ඔබගේ වීඩියෝ සංස්කරණය පහසු කරගන්න.'
  }
];

export const DEMO_SUBTITLES_EN: SubtitleSegment[] = [
  {
    id: 'seg-1',
    start: 0.5,
    end: 3.8,
    text: 'Ayubowan! Welcome to CaptionLK.'
  },
  {
    id: 'seg-2',
    start: 4.2,
    end: 8.5,
    text: 'This is the 100% client-side, browser-powered Sinhala AI subtitle generator.'
  },
  {
    id: 'seg-3',
    start: 9.0,
    end: 13.6,
    text: 'Your video files never touch any external server, ensuring absolute privacy.'
  },
  {
    id: 'seg-4',
    start: 14.1,
    end: 18.2,
    text: 'Instantly export .SRT and .VTT files to accelerate your video workflow.'
  }
];

/**
 * Synthesizes a demo audio WAV blob using Web Audio API
 * containing harmonic tones matching the demo subtitle timing
 */
export function createDemoAudioWav(): { blob: Blob; url: string; duration: number } {
  const sampleRate = 16000;
  const duration = 19; // seconds
  const totalSamples = sampleRate * duration;
  const pcm = new Float32Array(totalSamples);

  // Generate pleasant harmonic speech-like patterns at segment timings
  const segments = [
    { start: 0.5, end: 3.8, freq: 220 },
    { start: 4.2, end: 8.5, freq: 260 },
    { start: 9.0, end: 13.6, freq: 240 },
    { start: 14.1, end: 18.2, freq: 280 }
  ];

  for (const seg of segments) {
    const startIdx = Math.floor(seg.start * sampleRate);
    const endIdx = Math.floor(seg.end * sampleRate);
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / sampleRate;
      // Speech envelope: soft attack & decay
      const attack = Math.min(1, t * 10);
      const decay = Math.min(1, ((endIdx - i) / sampleRate) * 10);
      const envelope = attack * decay * 0.35;
      // Harmonic tones mimicking speech formants
      const f = seg.freq;
      const wave =
        Math.sin(2 * Math.PI * f * t) * 0.5 +
        Math.sin(2 * Math.PI * f * 2 * t) * 0.25 +
        Math.sin(2 * Math.PI * f * 3 * t) * 0.125;
      pcm[i] = wave * envelope;
    }
  }

  // Encode to 16-bit PCM WAV container
  const wavBuffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // 16 bits per sample
  writeString(36, 'data');
  view.setUint32(40, totalSamples * 2, true);

  // Write PCM data
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  return { blob, url, duration };
}
