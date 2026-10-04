# CaptionLK | Free 100% Client-Side AI Sinhala Caption Generator

> **100% Privacy-First, Zero-Server AI Subtitle & Caption Studio** built with **Astro**, **React (Islands Architecture)**, **Transformers.js (Whisper AI)**, **FFmpeg.wasm**, and **Tailwind CSS**.

🔗 **Live Website**: [https://captionlk.github.io](https://captionlk.github.io)  
☕ **Support Developer**: [https://buymeacoffee.com/kisharadilz](https://buymeacoffee.com/kisharadilz)

---

## 🌟 Key Highlights

- **🔒 100% Zero-Server Privacy**: Your video and audio recordings never leave your computer. All demuxing, audio decoding, and speech-to-text inference run purely client-side inside the browser.
- **⚡ Local Whisper AI Inference**: Powered by `@huggingface/transformers` using ONNX-quantized multilingual Whisper models with WebGPU acceleration and WebAssembly fallback.
- **🎧 FFmpeg.wasm + Web Audio API**: Dual-engine audio extraction to reliably demux 16kHz mono PCM audio from MP4, WebM, MKV, MOV, MP3, WAV, M4A, and OGG files.
- **🎬 Interactive Split-Pane Workspace**:
  - **HTML5 Player**: Video/audio playback with real-time synchronized caption overlay.
  - **Editable Timeline**: Inline editing of Sinhala subtitle text, timestamps (`HH:MM:SS,mmm`), split, merge, delete, and add segment.
  - **Styling Studio**: Customize font family (*Noto Sans Sinhala*, Inter, Roboto), size, colors, background opacity, text shadow, and vertical positioning.
- **📥 Instant Multi-Format Export**: One-click download for `.srt` (SubRip), `.vtt` (WebVTT), `.txt` (plain transcript), and `.json` data, plus clipboard copying.
- **🌐 Dual-Locale i18n & Technical SEO**:
  - English (`/`) and Sinhala (`/si/`) subpath routing.
  - Canonical links, hreflang alternates (`x-default`, `en`, `si`), Open Graph, and Twitter Cards.
  - Injected `WebApplication`, `SoftwareApplication`, and `FAQPage` JSON-LD schemas.
- **📱 Strict Responsive Icon Navigation**: Full labels on desktop; strictly collapsed to **ICONS ONLY** on mobile and tablet devices.

---

## 🏗️ Architecture

```
captionlk/
├── .github/workflows/deploy.yml   # GitHub Actions automated deploy to GitHub Pages
├── public/
│   ├── favicon.svg                # Branded vector favicon
│   ├── og-image.svg               # High-res Open Graph graphic
│   ├── robots.txt                 # Search engine directives
│   └── sitemap.xml                # XML sitemap with multilingual hreflang
├── src/
│   ├── components/
│   │   ├── CaptionEngine.tsx      # Core React Island (Upload, AI progress, split view)
│   │   ├── VideoPlayer.tsx        # HTML5 player with live subtitle overlay
│   │   ├── SubtitleTimeline.tsx   # Interactive subtitle list & inline editor
│   │   ├── SubtitleStyler.tsx     # Custom font, color, opacity & position controls
│   │   ├── ExportModal.tsx        # SRT / VTT / TXT / JSON export dialog
│   │   ├── Navbar.tsx             # Responsive nav (Icons-only on mobile/tablet)
│   │   ├── Footer.astro           # Branded footer & credits
│   │   └── SEO.astro              # Technical SEO & JSON-LD schemas
│   ├── i18n/
│   │   └── translations.ts        # English & Sinhala localization dictionary
│   ├── layouts/
│   │   └── BaseLayout.astro       # Base HTML shell with theme flash prevention
│   ├── pages/
│   │   ├── index.astro            # English home page (/)
│   │   └── si/
│   │       └── index.astro        # Sinhala localized page (/si/)
│   ├── styles/
│   │   └── global.css             # Tailwind v4 styles & Noto Sans Sinhala font utility
│   ├── types/
│   │   └── subtitle.ts            # Subtitle styling types & defaults
│   ├── utils/
│   │   ├── audioExtractor.ts      # Web Audio API + FFmpeg.wasm 16kHz extraction
│   │   ├── sampleData.ts          # Instant 1-click synthesized Sinhala sample audio
│   │   └── srtParser.ts           # SRT/VTT parsing, formatting, and file downloads
│   └── workers/
│       └── whisper.worker.ts      # Dedicated Web Worker for Whisper AI inference
├── astro.config.mjs               # Astro + React + Tailwind Vite configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 22`
- npm `>= 10`

### Installation

```bash
# Clone the repository
git clone https://github.com/captionlk/captionlk.github.io.git
cd captionlk.github.io

# Install dependencies
npm install
```

### Development

```bash
# Run local development server
npm run dev

# Or with background mode
npx astro dev --background
```

Open `http://localhost:4321` in your browser.

### Production Build

```bash
npm run build
```

The output will be generated in `./dist/` ready to be served by any static host or GitHub Pages.

---

## ☕ Support the Developer

If CaptionLK helped you create content or saved you subscription costs, consider supporting development:

👉 **[buymeacoffee.com/kisharadilz](https://buymeacoffee.com/kisharadilz)**

---

## 📄 License

MIT © [CaptionLK](https://captionlk.github.io)
