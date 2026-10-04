import React, { useRef, useEffect } from 'react';
import type { SubtitleSegment } from '../utils/srtParser';
import { formatTime, parseTime } from '../utils/srtParser';
import { translations, type Locale } from '../i18n/translations';
import { singlishToSinhala } from '../utils/singlishConverter';
import { Play, Trash2, Split, Plus, ArrowDown, Clock, Wand2, Languages } from 'lucide-react';

interface SubtitleTimelineProps {
  subtitles: SubtitleSegment[];
  currentLocale: Locale;
  currentTime: number;
  onUpdateSubtitle: (id: string, updated: Partial<SubtitleSegment>) => void;
  onDeleteSubtitle: (id: string) => void;
  onAddSubtitle: (atTime?: number) => void;
  onSplitSubtitle: (id: string) => void;
  onMergeWithNext: (id: string) => void;
  onConvertAllToSinhala?: () => void;
  onSeekTo: (time: number) => void;
}

export const SubtitleTimeline: React.FC<SubtitleTimelineProps> = ({
  subtitles,
  currentLocale,
  currentTime,
  onUpdateSubtitle,
  onDeleteSubtitle,
  onAddSubtitle,
  onSplitSubtitle,
  onMergeWithNext,
  onConvertAllToSinhala,
  onSeekTo
}) => {
  const t = translations[currentLocale];
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeCardRef.current) {
      activeCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentTime]);

  const handleConvertSingle = (id: string, currentText: string) => {
    const converted = singlishToSinhala(currentText);
    onUpdateSubtitle(id, { text: converted });
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF2EB] dark:bg-[#13221C] rounded-3xl border border-[#EADBCE] dark:border-[#223B30] shadow-sm overflow-hidden">
      {/* Header bar with actions */}
      <div className="px-4 py-3 border-b border-[#EADBCE] dark:border-[#223B30] bg-[#FAF4EE]/70 dark:bg-[#0E1713]/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA]" />
          <h3 className="font-bold text-sm text-[#331C13] dark:text-[#F7EAE0]">
            {t.timelineTitle}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1D4533]/10 dark:bg-[#1D4533]/50 text-[#1D4533] dark:text-[#F9D2BA] font-mono font-bold">
            {subtitles.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Convert Singlish to Sinhala Letters Button */}
          {subtitles.length > 0 && onConvertAllToSinhala && (
            <button
              type="button"
              onClick={onConvertAllToSinhala}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#F9D2BA] hover:bg-[#F5C2A3] text-[#5E3122] transition-all cursor-pointer shadow-xs"
              title="Convert all Singlish text into authentic Sinhala Unicode letters (සිංහල අකුරු)"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Singlish → සිංහල</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onAddSubtitle(currentTime)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1D4533] hover:bg-[#265B43] text-[#F7EAE0] shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>{t.addSubtitle}</span>
          </button>
        </div>
      </div>

      {/* Subtitles Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[520px]">
        {subtitles.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#5E3122]/50 dark:text-[#F7EAE0]/40">
            <Clock className="w-8 h-8 mb-2 opacity-50 text-[#1D4533]" />
            <p className="text-sm font-medium">{t.noSubtitlesYet}</p>
          </div>
        ) : (
          subtitles.map((seg, index) => {
            const isActive = currentTime >= seg.start && currentTime <= seg.end;
            const hasSinglish = /[a-zA-Z]{2,}/.test(seg.text);

            return (
              <div
                key={seg.id}
                ref={isActive ? activeCardRef : null}
                className={`group relative p-3 rounded-2xl border transition-all duration-150 ${
                  isActive
                    ? 'border-[#1D4533] dark:border-[#F9D2BA] bg-[#EBF3EF] dark:bg-[#1D4533]/40 shadow-md ring-1 ring-[#1D4533]/30 dark:ring-[#F9D2BA]/30'
                    : 'border-[#E0CEBF]/60 dark:border-[#253D32] bg-white/70 dark:bg-[#0E1713]/70 hover:border-[#1D4533]/50 dark:hover:border-[#F9D2BA]/50'
                }`}
              >
                {/* Top bar: Index, Timestamps, Seek */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E0CEBF]/50 dark:bg-[#111E18] text-[#5E3122] dark:text-[#F9D2BA] text-xs font-mono font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>

                    {/* Start Time Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        defaultValue={formatTime(seg.start, 'srt')}
                        onBlur={(e) => {
                          const newSec = parseTime(e.target.value);
                          onUpdateSubtitle(seg.id, { start: newSec });
                        }}
                        className="w-24 px-1.5 py-1 text-xs font-mono rounded-lg bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] text-center focus:ring-1 focus:ring-[#1D4533]"
                        title={t.startTime}
                      />
                      <span className="text-[#5E3122]/50 text-xs">→</span>
                      {/* End Time Input */}
                      <input
                        type="text"
                        defaultValue={formatTime(seg.end, 'srt')}
                        onBlur={(e) => {
                          const newSec = parseTime(e.target.value);
                          onUpdateSubtitle(seg.id, { end: newSec });
                        }}
                        className="w-24 px-1.5 py-1 text-xs font-mono rounded-lg bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] text-center focus:ring-1 focus:ring-[#1D4533]"
                        title={t.endTime}
                      />
                    </div>
                  </div>

                  {/* Actions: Convert Singlish, Play seek, split, merge, delete */}
                  <div className="flex items-center gap-1">
                    {/* Convert Singlish Button on Segment */}
                    {hasSinglish && (
                      <button
                        type="button"
                        onClick={() => handleConvertSingle(seg.id, seg.text)}
                        className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#F9D2BA] hover:bg-[#F5C2A3] text-[#5E3122] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Convert Singlish text to Sinhala letters (සිංහල අකුරු)"
                      >
                        <Languages className="w-3 h-3" />
                        <span>සිංහල</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSeekTo(seg.start)}
                      className="p-1 rounded-lg text-[#1D4533] dark:text-[#F9D2BA] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/50 transition-colors cursor-pointer"
                      title={t.playSegment}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSplitSubtitle(seg.id)}
                      className="p-1 rounded-lg text-[#5E3122] dark:text-[#F7EAE0] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/50 transition-colors cursor-pointer"
                      title={t.splitSegment}
                    >
                      <Split className="w-3.5 h-3.5" />
                    </button>

                    {index < subtitles.length - 1 && (
                      <button
                        type="button"
                        onClick={() => onMergeWithNext(seg.id)}
                        className="p-1 rounded-lg text-[#5E3122] dark:text-[#F7EAE0] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/50 transition-colors cursor-pointer"
                        title={t.mergeSegment}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onDeleteSubtitle(seg.id)}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={t.deleteSegment}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle Text Textarea */}
                <textarea
                  value={seg.text}
                  onChange={(e) => onUpdateSubtitle(seg.id, { text: e.target.value })}
                  placeholder={t.textPlaceholder}
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded-xl text-sm bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] font-sinhala leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#1D4533]"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
