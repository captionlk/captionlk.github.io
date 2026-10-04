import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import type { SubtitleSegment } from '../utils/srtParser';
import type { SubtitleStyle } from '../types/subtitle';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Film } from 'lucide-react';

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
}

interface VideoPlayerProps {
  mediaUrl: string | null;
  mediaType: 'video' | 'audio' | null;
  fileName: string | null;
  subtitles: SubtitleSegment[];
  style: SubtitleStyle;
  onTimeUpdate?: (currentTime: number) => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  mediaUrl,
  mediaType,
  fileName,
  subtitles,
  style,
  onTimeUpdate
}, ref) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (mediaRef.current) {
        mediaRef.current.currentTime = Math.max(0, Math.min(time, duration || 99999));
        setCurrentTime(time);
      }
    },
    play: () => {
      mediaRef.current?.play();
    },
    pause: () => {
      mediaRef.current?.pause();
    },
    getCurrentTime: () => mediaRef.current?.currentTime || 0
  }));

  useEffect(() => {
    const current = subtitles.find(
      seg => currentTime >= seg.start && currentTime <= seg.end
    );
    setActiveSubtitle(current ? current.text : '');
  }, [currentTime, subtitles]);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const time = mediaRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!mediaRef.current) return;
    mediaRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (mediaRef.current) {
      mediaRef.current.volume = val;
      mediaRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getRgba = (hex: string, opacity: number) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2) || '00', 16);
    const g = parseInt(cleanHex.substring(2, 4) || '00', 16);
    const b = parseInt(cleanHex.substring(4, 6) || '00', 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getTextShadow = () => {
    switch (style.textShadow) {
      case 'none':
        return 'none';
      case 'soft':
        return '0 2px 4px rgba(0,0,0,0.6)';
      case 'heavy':
        return '0 3px 8px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)';
      case 'outline':
      default:
        return '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 4px rgba(0,0,0,0.7)';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-[#0E1713] rounded-2xl overflow-hidden shadow-xl border border-[#EADBCE] dark:border-[#223B30] flex flex-col group select-none"
    >
      {/* Media Rendering Stage */}
      <div className="relative w-full aspect-video flex items-center justify-center bg-[#070E0B] overflow-hidden">
        {mediaUrl ? (
          mediaType === 'audio' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#13221C] to-[#070E0B]">
              <audio
                ref={mediaRef as any}
                src={mediaUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="w-20 h-20 rounded-full bg-[#1D4533]/40 border border-[#F9D2BA]/40 flex items-center justify-center text-[#F9D2BA] mb-4 animate-pulse">
                <Film className="w-10 h-10" />
              </div>
              <p className="text-[#F7EAE0] font-bold text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                {fileName || 'Audio Track'}
              </p>
              <span className="text-xs text-[#F9D2BA]/80 mt-1">Audio-Only Waveform View</span>
            </div>
          ) : (
            <video
              ref={mediaRef as any}
              src={mediaUrl}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              playsInline
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-[#E0CEBF]/60 text-center">
            <Film className="w-12 h-12 mb-3 text-[#1D4533]" />
            <p className="text-sm font-semibold text-[#F7EAE0]/70">No media loaded</p>
            <p className="text-xs text-[#E0CEBF]/60 mt-1">Upload a video or audio file above to start</p>
          </div>
        )}

        {/* Real-time Subtitle Overlay on Video */}
        {activeSubtitle && (
          <div
            className="absolute left-0 right-0 px-4 sm:px-8 text-center pointer-events-none transition-all duration-75"
            style={{
              top: style.verticalPosition === 'top' ? `${style.verticalOffset}%` : undefined,
              bottom: style.verticalPosition === 'bottom' ? `${style.verticalOffset}%` : undefined,
              top: style.verticalPosition === 'center' ? '50%' : undefined,
              transform: style.verticalPosition === 'center' ? 'translateY(-50%)' : undefined,
              zIndex: 30
            }}
          >
            <span
              className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg leading-relaxed font-sinhala transition-all"
              style={{
                fontFamily: style.fontFamily,
                fontSize: `${style.fontSize}px`,
                color: style.color,
                backgroundColor: getRgba(style.backgroundColor, style.backgroundOpacity),
                textShadow: getTextShadow(),
                maxWidth: '90%',
                wordBreak: 'break-word'
              }}
            >
              {activeSubtitle}
            </span>
          </div>
        )}
      </div>

      {/* Sleek Custom Media Controls Bar */}
      {mediaUrl && (
        <div className="bg-[#111E18]/95 border-t border-[#223B30] px-3 sm:px-4 py-2.5 flex flex-col gap-2 text-[#F7EAE0]">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#F9D2BA] min-w-[40px]">
              {formatSeconds(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#223B30] rounded-lg appearance-none cursor-pointer accent-[#F9D2BA] hover:accent-white"
            />
            <span className="text-xs font-mono text-[#F7EAE0]/70 min-w-[40px]">
              {formatSeconds(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-[#1D4533] hover:bg-[#285E46] text-[#F9D2BA] border border-[#2D5A45] transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (mediaRef.current) {
                    mediaRef.current.currentTime = Math.max(0, mediaRef.current.currentTime - 5);
                  }
                }}
                className="p-1.5 rounded-lg text-[#F7EAE0]/70 hover:text-white hover:bg-[#1D4533]/40 transition-colors"
                title="Rewind 5s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-[#F7EAE0]/70 hover:text-white hover:bg-[#1D4533]/40 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-[#223B30] rounded-lg appearance-none cursor-pointer accent-[#F9D2BA] hidden sm:block"
                />
              </div>
            </div>

            {/* Right side: Speed and Fullscreen */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center bg-[#070E0B] rounded-lg p-0.5 border border-[#223B30]">
                {[0.75, 1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => handlePlaybackRate(rate)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                      playbackRate === rate
                        ? 'bg-[#1D4533] text-[#F9D2BA]'
                        : 'text-[#F7EAE0]/70 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {mediaType !== 'audio' && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg text-[#F7EAE0]/70 hover:text-white hover:bg-[#1D4533]/40 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
