import React from 'react';
import type { SubtitleStyle } from '../types/subtitle';
import { DEFAULT_SUBTITLE_STYLE } from '../types/subtitle';
import { translations, type Locale } from '../i18n/translations';
import { Sliders, RotateCcw, Palette, Type, AlignVerticalJustifyCenter } from 'lucide-react';

interface SubtitleStylerProps {
  style: SubtitleStyle;
  onChangeStyle: (style: SubtitleStyle) => void;
  currentLocale: Locale;
}

export const SubtitleStyler: React.FC<SubtitleStylerProps> = ({
  style,
  onChangeStyle,
  currentLocale
}) => {
  const t = translations[currentLocale];

  const update = (partial: Partial<SubtitleStyle>) => {
    onChangeStyle({ ...style, ...partial });
  };

  const fontOptions = [
    { label: 'Noto Sans Sinhala (Recommended)', value: "'Noto Sans Sinhala', 'Inter', system-ui, sans-serif" },
    { label: 'Inter / Modern Sans', value: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
    { label: 'Roboto', value: "'Roboto', sans-serif" },
    { label: 'Arial Clean', value: 'Arial, Helvetica, sans-serif' },
    { label: 'Monospace Code', value: 'ui-monospace, SFMono-Regular, monospace' }
  ];

  // Palette swatches including #F7EAE0, #F9D2BA, #1D4533, #5E3122
  const colorPresets = ['#FFFFFF', '#F7EAE0', '#F9D2BA', '#FACC15', '#4ADE80'];
  const bgPresets = ['#1D4533', '#5E3122', '#0E1713', '#000000', '#253D32'];

  return (
    <div className="bg-[#FAF2EB] dark:bg-[#13221C] rounded-2xl border border-[#EADBCE] dark:border-[#223B30] shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] dark:border-[#223B30]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA]" />
          <h3 className="font-bold text-sm text-[#331C13] dark:text-[#F7EAE0]">
            {t.stylerTitle}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onChangeStyle(DEFAULT_SUBTITLE_STYLE)}
          className="flex items-center gap-1 text-xs text-[#5E3122] hover:text-[#1D4533] dark:text-[#F7EAE0]/70 dark:hover:text-[#F9D2BA] transition-colors"
          title={t.resetStyles}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.resetStyles}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Font Family */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="flex items-center gap-1.5 text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <Type className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
            <span>{t.fontFamily}</span>
          </label>
          <select
            value={style.fontFamily}
            onChange={(e) => update({ fontFamily: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0E1713] border border-[#E0CEBF] dark:border-[#253D32] text-[#331C13] dark:text-[#F7EAE0] font-sans focus:ring-1 focus:ring-[#1D4533]"
          >
            {fontOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <span>{t.fontSize}</span>
            <span className="font-mono text-[#1D4533] dark:text-[#F9D2BA] font-bold">{style.fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="40"
            step="1"
            value={style.fontSize}
            onChange={(e) => update({ fontSize: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-[#EADBCE] dark:bg-[#253D32] rounded-lg appearance-none cursor-pointer accent-[#1D4533] dark:accent-[#F9D2BA]"
          />
        </div>

        {/* Background Opacity */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <span>{t.bgOpacity}</span>
            <span className="font-mono text-[#1D4533] dark:text-[#F9D2BA] font-bold">
              {Math.round(style.backgroundOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={style.backgroundOpacity}
            onChange={(e) => update({ backgroundOpacity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#EADBCE] dark:bg-[#253D32] rounded-lg appearance-none cursor-pointer accent-[#1D4533] dark:accent-[#F9D2BA]"
          />
        </div>

        {/* Text Color */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <Palette className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
            <span>{t.textColor}</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-7 h-7 rounded border border-[#E0CEBF] dark:border-[#253D32] cursor-pointer p-0 bg-transparent"
            />
            <div className="flex items-center gap-1">
              {colorPresets.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ color: c })}
                  className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-600 shadow-xs"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <span>{t.bgColor}</span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-7 h-7 rounded border border-[#E0CEBF] dark:border-[#253D32] cursor-pointer p-0 bg-transparent"
            />
            <div className="flex items-center gap-1">
              {bgPresets.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ backgroundColor: c })}
                  className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-600 shadow-xs"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Shadow */}
        <div className="space-y-1.5">
          <label className="text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            {t.textShadow}
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(['none', 'soft', 'outline', 'heavy'] as const).map((shadow) => (
              <button
                key={shadow}
                type="button"
                onClick={() => update({ textShadow: shadow })}
                className={`py-1 text-center rounded-lg capitalize text-[11px] font-bold transition-colors ${
                  style.textShadow === shadow
                    ? 'bg-[#1D4533] text-[#F9D2BA]'
                    : 'bg-white/60 dark:bg-[#0E1713] text-[#5E3122] dark:text-[#F7EAE0] hover:bg-[#F9D2BA]/30'
                }`}
              >
                {shadow}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Position */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[#331C13] dark:text-[#F7EAE0] font-semibold">
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5 text-[#1D4533] dark:text-[#F9D2BA]" />
            <span>{t.verticalPosition}</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { val: 'bottom', label: t.posBottom },
              { val: 'center', label: t.posCenter },
              { val: 'top', label: t.posTop }
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => update({ verticalPosition: p.val as any })}
                className={`py-1 text-center rounded-lg text-[11px] font-bold transition-colors ${
                  style.verticalPosition === p.val
                    ? 'bg-[#1D4533] text-[#F9D2BA]'
                    : 'bg-white/60 dark:bg-[#0E1713] text-[#5E3122] dark:text-[#F7EAE0] hover:bg-[#F9D2BA]/30'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
