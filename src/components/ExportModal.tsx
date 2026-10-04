import React, { useState } from 'react';
import type { SubtitleSegment } from '../utils/srtParser';
import { generateSrt, generateVtt, generateTxt, generateJson, downloadFile } from '../utils/srtParser';
import { translations, type Locale } from '../i18n/translations';
import { X, Download, FileText, Check, Copy, Code, Sparkles } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtitles: SubtitleSegment[];
  currentLocale: Locale;
  fileName: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  subtitles,
  currentLocale,
  fileName
}) => {
  const t = translations[currentLocale];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseName = (fileName ? fileName.replace(/\.[^/.]+$/, '') : 'captionlk_sinhala') + '_subtitles';

  const handleDownloadSrt = () => {
    const content = generateSrt(subtitles);
    downloadFile(content, `${baseName}.srt`, 'application/x-subrip;charset=utf-8');
  };

  const handleDownloadVtt = () => {
    const content = generateVtt(subtitles);
    downloadFile(content, `${baseName}.vtt`, 'text/vtt;charset=utf-8');
  };

  const handleDownloadTxt = () => {
    const content = generateTxt(subtitles);
    downloadFile(content, `${baseName}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJson = () => {
    const content = generateJson(subtitles, { sourceFileName: fileName });
    downloadFile(content, `${baseName}.json`, 'application/json;charset=utf-8');
  };

  const handleCopyClipboard = async () => {
    const srt = generateSrt(subtitles);
    await navigator.clipboard.writeText(srt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#FAF2EB] dark:bg-[#13221C] rounded-3xl border border-[#EADBCE] dark:border-[#223B30] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EADBCE] dark:border-[#223B30] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1D4533]/15 text-[#1D4533] dark:text-[#F9D2BA] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#331C13] dark:text-[#F7EAE0]">
              {t.exportModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5E3122]/70 hover:text-[#331C13] dark:text-[#F7EAE0]/70 dark:hover:text-[#F7EAE0] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-5 space-y-3">
          
          {/* SRT Export Card */}
          <button
            type="button"
            onClick={handleDownloadSrt}
            className="w-full p-3.5 rounded-2xl border border-[#1D4533]/30 bg-[#EBF3EF] dark:bg-[#1D4533]/25 hover:bg-[#E0EFE8] dark:hover:bg-[#1D4533]/40 flex items-start gap-3.5 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#331C13] dark:text-[#F7EAE0]">
                  {t.exportSrt}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1D4533] text-[#F9D2BA] uppercase">
                  Popular
                </span>
              </div>
              <p className="text-xs text-[#5E3122]/80 dark:text-[#F7EAE0]/70 mt-0.5">
                {t.exportSrtDesc}
              </p>
            </div>
          </button>

          {/* VTT Export Card */}
          <button
            type="button"
            onClick={handleDownloadVtt}
            className="w-full p-3.5 rounded-2xl border border-[#EADBCE] dark:border-[#223B30] hover:border-[#1D4533]/40 bg-white/70 dark:bg-[#0E1713]/70 hover:bg-[#FAF4EE] dark:hover:bg-[#111E18] flex items-start gap-3.5 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#5E3122] text-[#F9D2BA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-sm text-[#331C13] dark:text-[#F7EAE0]">
                {t.exportVtt}
              </span>
              <p className="text-xs text-[#5E3122]/80 dark:text-[#F7EAE0]/70 mt-0.5">
                {t.exportVttDesc}
              </p>
            </div>
          </button>

          {/* Plain TXT & JSON Export Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="p-3 rounded-2xl border border-[#EADBCE] dark:border-[#223B30] hover:border-[#1D4533]/40 bg-white/70 dark:bg-[#0E1713]/70 hover:bg-[#FAF4EE] dark:hover:bg-[#111E18] flex items-center gap-2.5 text-left transition-all"
            >
              <FileText className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#331C13] dark:text-[#F7EAE0] block">
                  {t.exportTxt}
                </span>
                <span className="text-[11px] text-[#5E3122]/70 dark:text-[#F7EAE0]/60 block">Plain transcript</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="p-3 rounded-2xl border border-[#EADBCE] dark:border-[#223B30] hover:border-[#1D4533]/40 bg-white/70 dark:bg-[#0E1713]/70 hover:bg-[#FAF4EE] dark:hover:bg-[#111E18] flex items-center gap-2.5 text-left transition-all"
            >
              <Code className="w-4 h-4 text-[#5E3122] dark:text-[#F9D2BA] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#331C13] dark:text-[#F7EAE0] block">
                  {t.exportJson}
                </span>
                <span className="text-[11px] text-[#5E3122]/70 dark:text-[#F7EAE0]/60 block">Structured data</span>
              </div>
            </button>
          </div>

          {/* Copy to Clipboard */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E0CEBF] dark:border-[#253D32] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 text-[#331C13] dark:text-[#F7EAE0] text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA]" />
                  <span className="text-[#1D4533] dark:text-[#F9D2BA]">{t.copiedToast}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copyClipboard}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#EADBCE] dark:border-[#223B30] bg-[#FAF4EE] dark:bg-[#0E1713] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-[#5E3122] dark:text-[#F7EAE0] hover:bg-[#E0CEBF]/40 dark:hover:bg-[#1D4533]/40 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
