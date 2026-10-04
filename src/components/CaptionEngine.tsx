import React, { useState, useRef, useEffect } from 'react';
import type { SubtitleSegment } from '../utils/srtParser';
import type { SubtitleStyle } from '../types/subtitle';
import { DEFAULT_SUBTITLE_STYLE } from '../types/subtitle';
import { translations, type Locale } from '../i18n/translations';
import { extract16kHzAudio } from '../utils/audioExtractor';
import { createDemoAudioWav, DEMO_SUBTITLES_SI } from '../utils/sampleData';
import { singlishToSinhala } from '../utils/singlishConverter';
import { VideoPlayer, type VideoPlayerRef } from './VideoPlayer';
import { SubtitleTimeline } from './SubtitleTimeline';
import { SubtitleStyler } from './SubtitleStyler';
import { ExportModal } from './ExportModal';
import { 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileAudio, 
  FileVideo, 
  Download, 
  Sliders, 
  ListMusic, 
  PlayCircle,
  HardDrive
} from 'lucide-react';

interface CaptionEngineProps {
  currentLocale: Locale;
}

type EngineStatus = 'idle' | 'extracting' | 'loading_model' | 'transcribing' | 'done' | 'error';

export const CaptionEngine: React.FC<CaptionEngineProps> = ({ currentLocale }) => {
  const t = translations[currentLocale];

  // Media state
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Subtitle state - Default to Sinhala Unicode letters
  const [subtitles, setSubtitles] = useState<SubtitleSegment[]>([]);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>(DEFAULT_SUBTITLE_STYLE);

  // Processing state
  const [status, setStatus] = useState<EngineStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'timeline' | 'style'>('timeline');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [whisperModel, setWhisperModel] = useState<string>('onnx-community/whisper-tiny');
  const [targetLang, setTargetLang] = useState<string>('si');
  const [deviceInfo, setDeviceInfo] = useState<string>('wasm');

  // References
  const playerRef = useRef<VideoPlayerRef>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Terminate worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle uploaded file
  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile) return;

    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }

    const isVideo = selectedFile.type.startsWith('video/') || /\.(mp4|webm|mkv|mov|avi)$/i.test(selectedFile.name);
    const url = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(formatBytes(selectedFile.size));
    setMediaType(isVideo ? 'video' : 'audio');
    setMediaUrl(url);
    setStatus('idle');
    setProgressPercent(0);
    setStatusMessage('');
  };

  // Load built-in demo audio with 100% REAL SINHALA LETTERS (never Singlish)
  const handleLoadSample = () => {
    const demo = createDemoAudioWav();
    setFile(demo.blob);
    setFileName('Sinhala_Sample_Preview.wav');
    setFileSize('593 KB');
    setMediaType('audio');
    setMediaUrl(demo.url);
    
    // Always load authentic Sinhala Unicode subtitles
    setSubtitles(DEMO_SUBTITLES_SI);
    setStatus('done');
    setStatusMessage(t.statusComplete);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Start transcription pipeline
  const handleStartTranscribing = async () => {
    if (!file) return;

    try {
      setStatus('extracting');
      setProgressPercent(15);
      setStatusMessage(t.statusExtractingAudio);

      // 1. Extract 16kHz mono audio via WebAudio / FFmpeg
      const audioPcm = await extract16kHzAudio(file, (stage, prog) => {
        if (stage === 'ffmpeg') {
          setStatusMessage(`Extracting audio with FFmpeg.wasm (${prog || 0}%)...`);
          setProgressPercent(Math.min(45, 15 + Math.round((prog || 0) * 0.3)));
        } else {
          setProgressPercent(35);
        }
      });

      setStatus('loading_model');
      setProgressPercent(45);
      setStatusMessage(t.statusLoadingModel);

      // 2. Initialize Web Worker if not already alive
      if (!workerRef.current) {
        workerRef.current = new Worker(
          new URL('../workers/whisper.worker.ts', import.meta.url),
          { type: 'module' }
        );
      }

      const worker = workerRef.current;

      worker.onmessage = (e: MessageEvent) => {
        const { type, data, status: workerStatus, result, error, device } = e.data;

        if (device) {
          setDeviceInfo(device);
        }

        if (type === 'download_progress') {
          if (data && typeof data.progress === 'number') {
            const dlPercent = Math.round(data.progress);
            setProgressPercent(45 + Math.round(dlPercent * 0.25));
            setStatusMessage(`Downloading Whisper AI model: ${data.file || 'weights'} (${dlPercent}%)...`);
          }
        } else if (type === 'status') {
          if (workerStatus === 'transcribing') {
            setStatus('transcribing');
            setProgressPercent(75);
            setStatusMessage(t.statusTranscribing);
          }
        } else if (type === 'transcribe_complete') {
          setStatus('done');
          setProgressPercent(100);
          setStatusMessage(t.statusComplete);

          // Parse segments from whisper output and guarantee Sinhala Unicode letters
          let generatedSegments: SubtitleSegment[] = [];
          if (result && Array.isArray(result.chunks) && result.chunks.length > 0) {
            generatedSegments = result.chunks.map((chunk: any, i: number) => {
              let text = (chunk.text || '').trim();
              // If target language is Sinhala or auto, convert any Singlish/Latin into authentic Sinhala Unicode!
              if (targetLang === 'si' || targetLang === 'auto') {
                text = singlishToSinhala(text);
              }
              return {
                id: `seg-${Date.now()}-${i}`,
                start: Array.isArray(chunk.timestamp) ? chunk.timestamp[0] ?? 0 : 0,
                end: Array.isArray(chunk.timestamp) ? chunk.timestamp[1] ?? (chunk.timestamp[0] + 3) : 3,
                text
              };
            });
          } else if (result && result.text) {
            let text = result.text.trim();
            if (targetLang === 'si' || targetLang === 'auto') {
              text = singlishToSinhala(text);
            }
            generatedSegments = [
              {
                id: `seg-${Date.now()}-1`,
                start: 0,
                end: 5,
                text
              }
            ];
          }

          if (generatedSegments.length === 0) {
            generatedSegments = [
              {
                id: `seg-${Date.now()}-1`,
                start: 0.5,
                end: 4.0,
                text: 'ආයුබෝවන්! සිංහල උපසිරැසි පෙළ මෙතැන සටහන් කරන්න.'
              }
            ];
          }

          setSubtitles(generatedSegments);
        } else if (type === 'error') {
          console.error('Worker error:', error);
          setStatus('error');
          setStatusMessage(`${t.statusError}: ${error}`);
        }
      };

      worker.postMessage({
        type: 'transcribe',
        model: whisperModel,
        audio: audioPcm,
        language: targetLang,
        task: 'transcribe'
      });

    } catch (err: any) {
      console.error('Transcription initiation failed:', err);
      setStatus('error');
      setStatusMessage(`${t.statusError}: ${err.message || 'Media decoding failed'}`);
    }
  };

  const handleUpdateSubtitle = (id: string, updated: Partial<SubtitleSegment>) => {
    setSubtitles(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const handleDeleteSubtitle = (id: string) => {
    setSubtitles(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSubtitle = (atTime: number = currentTime) => {
    const newSeg: SubtitleSegment = {
      id: `seg-${Date.now()}`,
      start: Math.round(atTime * 10) / 10,
      end: Math.round((atTime + 3) * 10) / 10,
      text: ''
    };
    setSubtitles(prev => [...prev, newSeg].sort((a, b) => a.start - b.start));
  };

  const handleSplitSubtitle = (id: string) => {
    setSubtitles(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const target = prev[idx];
      const mid = (target.start + target.end) / 2;
      const words = target.text.split(' ');
      const half = Math.ceil(words.length / 2);
      const text1 = words.slice(0, half).join(' ');
      const text2 = words.slice(half).join(' ');

      const seg1: SubtitleSegment = { ...target, end: mid, text: text1 };
      const seg2: SubtitleSegment = { id: `seg-${Date.now()}`, start: mid, end: target.end, text: text2 };

      const next = [...prev];
      next.splice(idx, 1, seg1, seg2);
      return next;
    });
  };

  const handleMergeWithNext = (id: string) => {
    setSubtitles(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const current = prev[idx];
      const next = prev[idx + 1];

      const merged: SubtitleSegment = {
        id: current.id,
        start: current.start,
        end: next.end,
        text: `${current.text} ${next.text}`.trim()
      };

      const copy = [...prev];
      copy.splice(idx, 2, merged);
      return copy;
    });
  };

  // Convert all current subtitles from Singlish to Sinhala Unicode letters
  const handleConvertAllToSinhala = () => {
    setSubtitles(prev => prev.map(s => ({
      ...s,
      text: singlishToSinhala(s.text)
    })));
  };

  const handleSeekTo = (time: number) => {
    playerRef.current?.seekTo(time);
  };

  const isProcessing = status === 'extracting' || status === 'loading_model' || status === 'transcribing';

  return (
    <div className="w-full space-y-6">
      
      {/* Step 1: Media Dropzone & Configuration Card */}
      <div className="bg-[#FAF2EB] dark:bg-[#13221C] rounded-3xl border border-[#EADBCE] dark:border-[#223B30] shadow-sm p-4 sm:p-6 transition-colors">
        
        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
            file
              ? 'border-[#1D4533] bg-[#EBF3EF] dark:bg-[#1D4533]/25'
              : 'border-[#E0CEBF] dark:border-[#253D32] hover:border-[#1D4533] dark:hover:border-[#F9D2BA] bg-white/60 dark:bg-[#0E1713]/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*,.mp4,.webm,.mkv,.mov,.avi,.mp3,.wav,.m4a,.ogg,.aac"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {file ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F7EAE0] flex items-center justify-center shadow-sm">
                  {mediaType === 'video' ? <FileVideo className="w-6 h-6 text-[#F9D2BA]" /> : <FileAudio className="w-6 h-6 text-[#F9D2BA]" />}
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold text-[#1D4533] dark:text-[#F9D2BA] uppercase tracking-wider block">
                    {t.fileDetails} ({mediaType?.toUpperCase()})
                  </span>
                  <p className="text-base font-bold text-[#331C13] dark:text-[#F7EAE0] truncate max-w-xs sm:max-w-md">
                    {fileName}
                  </p>
                  <span className="text-xs text-[#5E3122]/70 dark:text-[#F7EAE0]/60">{fileSize}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#E0CEBF] dark:border-[#253D32] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 text-[#5E3122] dark:text-[#F7EAE0] transition-colors cursor-pointer"
                >
                  {t.replaceFile}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF3EF] dark:bg-[#1D4533]/40 text-[#1D4533] dark:text-[#F9D2BA] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#331C13] dark:text-[#F7EAE0] mb-1">
                {t.dropzoneTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5E3122]/80 dark:text-[#F7EAE0]/70 mb-4 max-w-md">
                {t.dropzoneSubtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#265B43] text-[#F7EAE0] font-bold text-sm shadow-sm shadow-[#1D4533]/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#F9D2BA]" />
                  <span>{t.browseFiles}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-4 py-2.5 rounded-xl border border-[#E0CEBF] dark:border-[#253D32] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 text-[#5E3122] dark:text-[#F7EAE0] font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA]" />
                  <span>{t.loadSampleBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Engine Settings & Transcribe Button */}
        {file && (
          <div className="mt-5 pt-5 border-t border-[#EADBCE] dark:border-[#223B30] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              
              {/* Whisper Model Size */}
              <div className="space-y-1">
                <label className="text-[#331C13] dark:text-[#F7EAE0] font-semibold flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
                  <span>{t.modelLabel}</span>
                </label>
                <select
                  value={whisperModel}
                  disabled={isProcessing}
                  onChange={(e) => setWhisperModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] focus:ring-1 focus:ring-[#1D4533] font-sans disabled:opacity-60"
                >
                  <option value="onnx-community/whisper-tiny">{t.modelTiny}</option>
                  <option value="onnx-community/whisper-base">{t.modelBase}</option>
                </select>
              </div>

              {/* Target Language */}
              <div className="space-y-1">
                <label className="text-[#331C13] dark:text-[#F7EAE0] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
                  <span>{t.languageLabel}</span>
                </label>
                <select
                  value={targetLang}
                  disabled={isProcessing}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] focus:ring-1 focus:ring-[#1D4533] font-sans disabled:opacity-60"
                >
                  <option value="si">{t.sinhalaLang}</option>
                  <option value="en">{t.englishLang}</option>
                  <option value="auto">{t.autoDetect}</option>
                </select>
              </div>

              {/* Transcribe Trigger Button */}
              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleStartTranscribing}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    isProcessing
                      ? 'bg-[#1D4533]/70 text-[#F7EAE0] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#1D4533] to-[#5E3122] hover:from-[#265B43] hover:to-[#733D2B] text-[#F7EAE0] shadow-[#1D4533]/25 active:scale-98'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                      <span>{t.transcribingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
                      <span>{t.transcribeBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Progress Bar & Status Text */}
            {isProcessing && (
              <div className="space-y-2 pt-2 animate-in fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#1D4533] dark:text-[#F9D2BA] flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{statusMessage}</span>
                  </span>
                  <span className="font-mono font-bold text-[#5E3122] dark:text-[#F7EAE0]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#EADBCE] dark:bg-[#1D3328] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1D4533] via-[#5E3122] to-[#F9D2BA] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#5E3122]/70 dark:text-[#F7EAE0]/70">
                  {t.modelCacheNotice}
                </p>
              </div>
            )}

            {/* Success or Error banners */}
            {status === 'done' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#EBF3EF] dark:bg-[#1D4533]/30 border border-[#1D4533]/30 dark:border-[#1D4533]/50 text-[#1D4533] dark:text-[#F9D2BA] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA] shrink-0" />
                <span className="font-medium">{statusMessage || t.statusComplete}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span className="font-medium">{statusMessage || t.statusError}</span>
              </div>
            )}

            {/* Zero-Server Privacy Assurance Footer */}
            <div className="flex items-center justify-between text-[11px] text-[#5E3122]/70 dark:text-[#F7EAE0]/70 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
                <span>{t.privacyGuarantee}</span>
              </span>
              <span className="font-mono text-[10px] uppercase bg-[#EADBCE]/60 dark:bg-[#1D3328] text-[#5E3122] dark:text-[#F7EAE0] px-2 py-0.5 rounded">
                Engine: {deviceInfo.toUpperCase()}
              </span>
            </div>

          </div>
        )}

      </div>

      {/* Step 2 & 3: Interactive Split-View Workspace */}
      {mediaUrl && (
        <div className="space-y-4">
          
          {/* Workspace Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF2EB] dark:bg-[#13221C] p-3 rounded-2xl border border-[#EADBCE] dark:border-[#223B30] shadow-xs">
            <div className="flex items-center gap-1 bg-[#ECE0D5] dark:bg-[#0E1713] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-white dark:bg-[#1D4533] text-[#1D4533] dark:text-[#F9D2BA] shadow-xs'
                    : 'text-[#5E3122]/70 dark:text-[#F7EAE0]/70 hover:text-[#5E3122] dark:hover:text-[#F7EAE0]'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>{t.timelineTitle}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'style'
                    ? 'bg-white dark:bg-[#1D4533] text-[#1D4533] dark:text-[#F9D2BA] shadow-xs'
                    : 'text-[#5E3122]/70 dark:text-[#F7EAE0]/70 hover:text-[#5E3122] dark:hover:text-[#F7EAE0]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{t.stylerTitle}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D4533] hover:bg-[#265B43] text-[#F7EAE0] font-bold text-xs shadow-sm shadow-[#1D4533]/20 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#F9D2BA]" />
                <span>{t.exportSubtitle}</span>
              </button>
            </div>
          </div>

          {/* Split Panes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: HTML5 Video/Audio Player */}
            <div className="lg:col-span-7 space-y-4">
              <VideoPlayer
                ref={playerRef}
                mediaUrl={mediaUrl}
                mediaType={mediaType}
                fileName={fileName}
                subtitles={subtitles}
                style={subtitleStyle}
                onTimeUpdate={(time) => setCurrentTime(time)}
              />
            </div>

            {/* Right Column: Dynamic Timeline or Styler */}
            <div className="lg:col-span-5 space-y-4">
              {activeTab === 'timeline' ? (
                <SubtitleTimeline
                  subtitles={subtitles}
                  currentLocale={currentLocale}
                  currentTime={currentTime}
                  onUpdateSubtitle={handleUpdateSubtitle}
                  onDeleteSubtitle={handleDeleteSubtitle}
                  onAddSubtitle={handleAddSubtitle}
                  onSplitSubtitle={handleSplitSubtitle}
                  onMergeWithNext={handleMergeWithNext}
                  onConvertAllToSinhala={handleConvertAllToSinhala}
                  onSeekTo={handleSeekTo}
                />
              ) : (
                <SubtitleStyler
                  style={subtitleStyle}
                  onChangeStyle={setSubtitleStyle}
                  currentLocale={currentLocale}
                />
              )}
            </div>

          </div>

        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        subtitles={subtitles}
        currentLocale={currentLocale}
        fileName={fileName}
      />

    </div>
  );
};
