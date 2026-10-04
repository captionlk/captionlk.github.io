import React, { useEffect, useState } from 'react';
import { translations, type Locale } from '../i18n/translations';
import { Sun, Moon, Coffee, Globe, Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentLocale: Locale;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLocale }) => {
  const t = translations[currentLocale];
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isCurrentlyDark = root.classList.contains('dark') || theme === 'dark';
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    
    setTheme(nextTheme);
    try {
      localStorage.setItem('captionlk_theme', nextTheme);
    } catch {}

    if (nextTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (document.body) {
        document.body.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      }
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }
    }
  };

  const targetLangUrl = currentLocale === 'en' ? '/si/' : '/';
  const targetLangLabel = currentLocale === 'en' ? 'සිංහල' : 'English';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EADBCE] dark:border-[#223B30] bg-[#FAF2EB]/95 dark:bg-[#111E18]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Client-Side Badge */}
        <a 
          href={currentLocale === 'si' ? '/si/' : '/'} 
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D4533] via-[#2A6249] to-[#5E3122] flex items-center justify-center text-[#F7EAE0] shadow-sm shadow-[#1D4533]/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-[#F9D2BA]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#1D4533] dark:text-[#F7EAE0] font-sans">
                Caption<span className="text-[#5E3122] dark:text-[#F9D2BA]">LK</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-[#1D4533]/10 dark:bg-[#1D4533]/40 text-[#1D4533] dark:text-[#F9D2BA] border border-[#1D4533]/20 dark:border-[#1D4533]/40">
                <ShieldCheck className="w-3 h-3 text-[#1D4533] dark:text-[#F9D2BA]" />
                <span>100% Client AI</span>
              </span>
            </div>
            <span className="hidden md:block text-[11px] text-[#5E3122]/70 dark:text-[#F9D2BA]/70 -mt-1 font-medium">
              Free Sinhala Subtitle Studio
            </span>
          </div>
        </a>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          
          {/* Language Selector */}
          <a
            href={targetLangUrl}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-[#1D4533] dark:text-[#F7EAE0] hover:text-[#5E3122] dark:hover:text-[#F9D2BA] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 border border-[#EADBCE] dark:border-[#223B30] transition-all duration-150 cursor-pointer"
            title={`Switch to ${targetLangLabel}`}
            aria-label={`Switch to ${targetLangLabel}`}
          >
            <Globe className="w-4 h-4 text-[#1D4533] dark:text-[#F9D2BA] shrink-0" />
            {/* Desktop: Full text; Mobile & Tablet: STRICTLY ICONS ONLY */}
            <span className="hidden lg:inline font-sinhala font-medium">
              {targetLangLabel}
            </span>
            <span className="hidden sm:inline lg:hidden text-xs font-semibold uppercase">
              {currentLocale === 'en' ? 'SI' : 'EN'}
            </span>
          </a>

          {/* Light / Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl text-sm font-medium text-[#1D4533] dark:text-[#F7EAE0] hover:bg-[#F9D2BA]/30 dark:hover:bg-[#1D4533]/40 border border-[#EADBCE] dark:border-[#223B30] transition-all duration-150 cursor-pointer"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
            aria-label={t.themeToggle}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F9D2BA] shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[#5E3122] shrink-0" />
            )}
            {/* Desktop: Full text; Mobile & Tablet: STRICTLY ICONS ONLY */}
            <span className="hidden lg:inline">
              {theme === 'dark' ? t.lightMode : t.darkMode}
            </span>
          </button>

          {/* Support Developer CTA (Chestnut #5E3122 with Cream #F7EAE0 and Peach glow) */}
          <a
            href="https://buymeacoffee.com/kisharadilz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-sm font-bold bg-[#5E3122] hover:bg-[#733D2B] text-[#F7EAE0] shadow-sm shadow-[#5E3122]/20 active:scale-95 transition-all duration-150 border border-[#482519]"
            title="Buy me a coffee - Support Developer"
            aria-label={t.supportDev}
          >
            <Coffee className="w-4 h-4 text-[#F9D2BA] shrink-0 fill-current" />
            {/* Desktop: Full text; Mobile & Tablet: STRICTLY ICONS ONLY */}
            <span className="hidden lg:inline whitespace-nowrap">
              {t.supportDev}
            </span>
          </a>

        </div>
      </div>
    </header>
  );
};
