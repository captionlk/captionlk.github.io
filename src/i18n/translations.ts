export type Locale = 'en' | 'si';

export interface Translations {
  siteTitle: string;
  siteSubtitle: string;
  tagline: string;
  privacyBadge: string;
  supportDev: string;
  themeToggle: string;
  lightMode: string;
  darkMode: string;
  langSelect: string;
  
  // Hero & Uploader
  heroHeading: string;
  heroHighlight: string;
  heroDescription: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  browseFiles: string;
  sampleMediaPrompt: string;
  loadSampleBtn: string;
  supportedFormats: string;
  fileDetails: string;
  replaceFile: string;
  
  // AI Engine & Processing
  modelSettings: string;
  modelLabel: string;
  modelTiny: string;
  modelBase: string;
  languageLabel: string;
  sinhalaLang: string;
  englishLang: string;
  autoDetect: string;
  transcribeBtn: string;
  transcribingBtn: string;
  statusIdle: string;
  statusLoadingModel: string;
  statusExtractingAudio: string;
  statusTranscribing: string;
  statusComplete: string;
  statusError: string;
  modelCacheNotice: string;
  privacyGuarantee: string;
  
  // Editor
  videoPlayer: string;
  timelineTitle: string;
  stylerTitle: string;
  addSubtitle: string;
  exportSubtitle: string;
  noSubtitlesYet: string;
  startTime: string;
  endTime: string;
  textPlaceholder: string;
  playSegment: string;
  deleteSegment: string;
  splitSegment: string;
  mergeSegment: string;
  
  // Styling Studio
  fontFamily: string;
  fontSize: string;
  textColor: string;
  bgColor: string;
  bgOpacity: string;
  textShadow: string;
  verticalPosition: string;
  posBottom: string;
  posCenter: string;
  posTop: string;
  resetStyles: string;
  
  // Export Modal
  exportModalTitle: string;
  exportSrt: string;
  exportSrtDesc: string;
  exportVtt: string;
  exportVttDesc: string;
  exportTxt: string;
  exportTxtDesc: string;
  exportJson: string;
  exportJsonDesc: string;
  copyClipboard: string;
  copiedToast: string;
  close: string;
  
  // Features & SEO
  featuresTitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  footerRights: string;
  madeWithLove: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: 'CaptionLK',
    siteSubtitle: '100% Client-Side AI Sinhala Caption Generator',
    tagline: 'Private, Browser-Powered Speech-to-Text & Subtitle Studio',
    privacyBadge: '100% Zero-Server Privacy',
    supportDev: 'Support the Developer',
    themeToggle: 'Switch theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    langSelect: 'Language',
    
    heroHeading: 'Generate Sinhala Subtitles in Seconds with',
    heroHighlight: 'Local Browser AI',
    heroDescription: 'Zero-server transcription powered by Whisper AI and FFmpeg.wasm. Your video never leaves your computer, ensuring absolute privacy, zero bandwidth costs, and instant SRT/VTT exports.',
    dropzoneTitle: 'Drag & Drop your video or audio file here',
    dropzoneSubtitle: 'Supports MP4, WebM, MKV, MOV, MP3, WAV, M4A, OGG',
    browseFiles: 'Browse Files',
    sampleMediaPrompt: 'Want to test without uploading?',
    loadSampleBtn: 'Load Sinhala Audio Sample',
    supportedFormats: 'Maximum speed with browser-accelerated processing',
    fileDetails: 'Selected Media',
    replaceFile: 'Choose Another File',
    
    modelSettings: 'AI Transcription Engine Configuration',
    modelLabel: 'Whisper Model Size',
    modelTiny: 'Whisper Tiny (~39MB - Ultra Fast)',
    modelBase: 'Whisper Base (~73MB - High Accuracy)',
    languageLabel: 'Target Language',
    sinhalaLang: 'Sinhala (සිංහල)',
    englishLang: 'English',
    autoDetect: 'Auto-Detect',
    transcribeBtn: 'Generate Sinhala Subtitles',
    transcribingBtn: 'Transcribing in Browser...',
    statusIdle: 'Ready to transcribe',
    statusLoadingModel: 'Downloading & caching Whisper AI model (first visit only)...',
    statusExtractingAudio: 'Extracting 16kHz audio with FFmpeg.wasm...',
    statusTranscribing: 'AI transcribing audio to Sinhala subtitles...',
    statusComplete: 'Transcription finished successfully!',
    statusError: 'An error occurred during transcription.',
    modelCacheNotice: 'Whisper model is cached locally in your browser storage for future instant offline runs.',
    privacyGuarantee: 'Your audio & video files are processed strictly inside your device. No uploads to any server.',
    
    videoPlayer: 'Video Preview & Live Caption Overlay',
    timelineTitle: 'Subtitle Timeline & Editor',
    stylerTitle: 'Caption Styling Studio',
    addSubtitle: 'Add Subtitle at Timestamp',
    exportSubtitle: 'Export Subtitles',
    noSubtitlesYet: 'No subtitles yet. Upload a media file and click "Generate Sinhala Subtitles" to start.',
    startTime: 'Start',
    endTime: 'End',
    textPlaceholder: 'Type Sinhala or English subtitle text...',
    playSegment: 'Play',
    deleteSegment: 'Delete',
    splitSegment: 'Split',
    mergeSegment: 'Merge Next',
    
    fontFamily: 'Font Family',
    fontSize: 'Font Size',
    textColor: 'Text Color',
    bgColor: 'Background Color',
    bgOpacity: 'Background Opacity',
    textShadow: 'Text Shadow',
    verticalPosition: 'Vertical Alignment',
    posBottom: 'Bottom',
    posCenter: 'Center',
    posTop: 'Top',
    resetStyles: 'Reset to Defaults',
    
    exportModalTitle: 'Export Generated Subtitles',
    exportSrt: 'Download .SRT (SubRip)',
    exportSrtDesc: 'Standard format compatible with YouTube, Premiere, DaVinci, VLC, and CapCut.',
    exportVtt: 'Download .VTT (WebVTT)',
    exportVttDesc: 'Ideal for HTML5 video web players and streaming platforms.',
    exportTxt: 'Download Plain Text (.TXT)',
    exportTxtDesc: 'Raw transcript without timestamps for articles or blog posts.',
    exportJson: 'Download JSON Data',
    exportJsonDesc: 'Structured data with millisecond timestamps and metadata.',
    copyClipboard: 'Copy SRT to Clipboard',
    copiedToast: 'Copied to clipboard!',
    close: 'Close',
    
    featuresTitle: 'Why Choose CaptionLK for Sinhala Subtitles?',
    feature1Title: '100% Client-Side Privacy',
    feature1Desc: 'Your sensitive recordings, interviews, and confidential footage never touch an external server or cloud API. All inference runs right in your browser.',
    feature2Title: 'Powered by Whisper AI & FFmpeg',
    feature2Desc: 'State-of-the-art OpenAI Whisper speech recognition paired with FFmpeg WebAssembly for seamless video demuxing and crystal-clear Sinhala text output.',
    feature3Title: 'Instant Multi-Format Export',
    feature3Desc: 'Export perfectly formatted .SRT, .VTT, or plain transcripts with one click. Customize font, colors, and positioning with live player preview.',
    
    howItWorksTitle: 'How It Works in 3 Simple Steps',
    step1Title: '1. Select Media File',
    step1Desc: 'Drop an MP4 video or MP3 audio file into the workspace. FFmpeg extracts the audio stream client-side.',
    step2Title: '2. Local AI Transcription',
    step2Desc: 'Whisper AI processes the 16kHz speech stream directly on your GPU or CPU using WebAssembly/WebGPU.',
    step3Title: '3. Edit & Export SRT',
    step3Desc: 'Fine-tune Sinhala captions, adjust timestamps with millisecond precision, and download your SRT file.',
    
    faqTitle: 'Frequently Asked Questions (FAQ)',
    faqs: [
      {
        question: 'Is CaptionLK completely free to use?',
        answer: 'Yes! CaptionLK is 100% free and open-source. There are no subscriptions, paywalls, or daily upload limits because processing happens entirely on your own device.'
      },
      {
        question: 'Does my video or audio get uploaded to any server?',
        answer: 'Never. CaptionLK operates strictly client-side using Transformers.js and WebAssembly. Your media files and generated captions never leave your browser.'
      },
      {
        question: 'How accurate is the Sinhala speech recognition?',
        answer: 'CaptionLK uses OpenAI Whisper ONNX-quantized models trained on thousands of hours of multilingual speech, delivering strong recognition for Sinhala speech and mixed Sinhala-English (Singlish) contexts.'
      },
      {
        question: 'Can I use CaptionLK offline after the first visit?',
        answer: 'Yes. The Whisper model and WebAssembly binaries are automatically cached in your browser storage upon the initial download, enabling offline usage.'
      }
    ],
    footerRights: 'CaptionLK. Free 100% Client-Side AI Sinhala Caption Generator.',
    madeWithLove: 'Built with pride for Sri Lankan content creators & video editors.'
  },
  si: {
    siteTitle: 'CaptionLK',
    siteSubtitle: '100% ක්ලයන්ට්-සයිඩ් AI සිංහල උපසිරැසි ජනකය',
    tagline: 'පෞද්ගලිකත්වය සුරැකි, බ්‍රවුසරයෙන් ක්‍රියාත්මක වන කථනය-ලිඛිත කිරීමේ ස්ටුඩියෝව',
    privacyBadge: '100% ශුන්‍ය-සර්වර් පෞද්ගලිකත්වය',
    supportDev: 'සංවර්ධකයාට සහය වන්න',
    themeToggle: 'තේමාව මාරු කරන්න',
    lightMode: 'දිවා තේමාව',
    darkMode: 'රාත්‍රී තේමාව',
    langSelect: 'භාෂාව',
    
    heroHeading: 'තත්පර කිහිපයකින් සිංහල උපසිරැසි සාදාගන්න',
    heroHighlight: 'බ්‍රවුසරයේ ක්‍රියාත්මක AI තාක්ෂණයෙන්',
    heroDescription: 'Whisper AI සහ FFmpeg.wasm මඟින් බලගැන්වුණු ශුන්‍ය-සර්වර් උපසිරැසි සැකසුම. ඔබගේ වීඩියෝ කිසිවිටෙකත් ඔබගේ පරිගණකයෙන් පිටතට නොයන බැවින් 100% පෞද්ගලිකත්වය සහ ක්ෂණික SRT/VTT බාගැනීම්.',
    dropzoneTitle: 'ඔබගේ වීඩියෝ හෝ ඕඩියෝ ගොනුව මෙතැනට Drag & Drop කරන්න',
    dropzoneSubtitle: 'MP4, WebM, MKV, MOV, MP3, WAV, M4A, OGG ආදී සියලුම ආකෘති සඳහා සහය දක්වයි',
    browseFiles: 'ගොනුව තෝරන්න',
    sampleMediaPrompt: 'ඔබේම ගොනුවක් නැද්ද? නියැදි ශ්‍රව්‍ය පටයකින් අත්හදා බලන්න:',
    loadSampleBtn: 'නියැදි සිංහල ශ්‍රව්‍යය පූරණය කරන්න',
    supportedFormats: 'උපරිම වේගය සඳහා බ්‍රවුසර දෘඪාංග ත්වරණය',
    fileDetails: 'තෝරාගත් මාධ්‍යය',
    replaceFile: 'වෙනත් ගොනුවක් තෝරන්න',
    
    modelSettings: 'AI පරිවර්තන සැකසුම්',
    modelLabel: 'Whisper ආකෘති ප්‍රමාණය',
    modelTiny: 'Whisper Tiny (~39MB - ඉතා වේගවත්)',
    modelBase: 'Whisper Base (~73MB - උසස් නිවැරදිතාවය)',
    languageLabel: 'ඉලක්කගත භාෂාව',
    sinhalaLang: 'සිංහල (Sinhala)',
    englishLang: 'English (ඉංග්‍රීසි)',
    autoDetect: 'ස්වයංක්‍රීය හඳුනාගැනීම',
    transcribeBtn: 'සිංහල උපසිරැසි ජනනය කරන්න',
    transcribingBtn: 'බ්‍රවුසරය තුළ හඬ ලිඛිත කරමින් පවතී...',
    statusIdle: 'සූදානම්',
    statusLoadingModel: 'Whisper AI ආකෘතිය බාගත කර ගබඩා කරමින් පවතී (පළමු වරට පමණි)...',
    statusExtractingAudio: 'FFmpeg.wasm මඟින් ශ්‍රව්‍ය ධාවන පථය වෙන්කර ගනිමින් පවතී...',
    statusTranscribing: 'AI මඟින් සිංහල උපසිරැසි නිර්මාණය කරමින් පවතී...',
    statusComplete: 'උපසිරැසි නිර්මාණය සාර්ථකව අවසන් විය!',
    statusError: 'උපසිරැසි නිර්මාණයේදී දෝෂයක් සිදු විය.',
    modelCacheNotice: 'Whisper AI ආකෘතිය ඔබගේ බ්‍රවුසරයේ සුරැකෙන බැවින් ඊළඟ වාරවලදී ක්ෂණිකව සහ Offline ක්‍රියා කරයි.',
    privacyGuarantee: 'ඔබගේ වීඩියෝ සහ ඕඩියෝ සම්පූර්ණයෙන්ම ඔබගේ උපාංගය තුළ පමණක් සැකසේ. කිසිදු සර්වරයකට අප්ලෝඩ් නොවේ.',
    
    videoPlayer: 'වීඩියෝ පූර්වදර්ශනය සහ සජීවී උපසිරැසි',
    timelineTitle: 'උපසිරැසි කාලරේඛාව සහ සංස්කාරකය',
    stylerTitle: 'උපසිරැසි හැඩගැන්වීම් පැනලය',
    addSubtitle: 'නව උපසිරැසියක් එක් කරන්න',
    exportSubtitle: 'උපසිරැසි බාගන්න (Export)',
    noSubtitlesYet: 'තවමත් උපසිරැසි නොමැත. මාධ්‍ය ගොනුවක් තෝරා "සිංහල උපසිරැසි ජනනය කරන්න" ක්ලික් කරන්න.',
    startTime: 'ආරම්භය',
    endTime: 'අවසානය',
    textPlaceholder: 'සිංහල උපසිරැසි පෙළ මෙතැන සටහන් කරන්න...',
    playSegment: 'ධාවනය',
    deleteSegment: 'මකන්න',
    splitSegment: 'වෙන් කරන්න',
    mergeSegment: 'ඊළඟට එක් කරන්න',
    
    fontFamily: 'අකුරු විලාසය (Font)',
    fontSize: 'අකුරු ප්‍රමාණය',
    textColor: 'අකුරු පැහැය',
    bgColor: 'පසුබිම් පැහැය',
    bgOpacity: 'පසුබිම් පාරදෘශ්‍යතාවය',
    textShadow: 'අකුරු සෙවණැල්ල',
    verticalPosition: 'සිරස් පිහිටීම',
    posBottom: 'පහළ (Bottom)',
    posCenter: 'මැද (Center)',
    posTop: 'ඉහළ (Top)',
    resetStyles: 'මුල් සැකසුම් වෙත',
    
    exportModalTitle: 'උපසිරැසි ගොනුව බාගන්න',
    exportSrt: '.SRT ගොනුව බාගන්න (SubRip)',
    exportSrtDesc: 'YouTube, Premiere Pro, DaVinci Resolve, VLC සහ CapCut සමඟ 100% ගැළපේ.',
    exportVtt: '.VTT ගොනුව බාගන්න (WebVTT)',
    exportVttDesc: 'වෙබ් වීඩියෝ ප්ලේයර් සහ ඔන්ලයින් ස්ට්‍රීමිං සඳහා සුදුසුයි.',
    exportTxt: 'සරල පෙළ ගොනුව (.TXT)',
    exportTxtDesc: 'ලිපි, බ්ලොග් සහ සටහන් සඳහා කාලරාමු නොමැතිව පෙළ පමණක් ලබාගන්න.',
    exportJson: 'JSON දත්ත ගොනුව',
    exportJsonDesc: 'මිලි තත්පර කාල සටහන් සහිත පරිපූර්ණ දත්ත ගොනුව.',
    copyClipboard: 'SRT පෙළ Clipboard එකට පිටපත් කරන්න',
    copiedToast: 'Clipboard වෙත පිටපත් විය!',
    close: 'වසන්න',
    
    featuresTitle: 'සිංහල උපසිරැසි සඳහා CaptionLK තෝරාගත යුත්තේ ඇයි?',
    feature1Title: '100% පෞද්ගලිකත්ව ආරක්ෂාව',
    feature1Desc: 'ඔබගේ පුද්ගලික වීඩියෝ, සම්මුඛ සාකච්ඡා කිසිවිටෙකත් කිසිදු බාහිර සර්වරයකට හෝ ක්ලවුඩ් වෙත අප්ලෝඩ් නොවේ.',
    feature2Title: 'Whisper AI සහ FFmpeg බලගැන්වීම',
    feature2Desc: 'OpenAI Whisper නවීන කථන හඳුනාගැනීමේ තාක්ෂණය සහ FFmpeg WebAssembly හරහා නිවැරදි සිංහල උපසිරැසි නිමාවක්.',
    feature3Title: 'ක්ෂණික බහුවිධ Export පහසුකම',
    feature3Desc: 'එක් ක්ලික් කිරීමකින් .SRT, .VTT ආදී අවශ්‍ය ආකෘතියකින් බාගන්න. අකුරු ප්‍රමාණය, වර්ණය සහ පිහිටීම පහසුවෙන් වෙනස් කරන්න.',
    
    howItWorksTitle: 'සරල පියවර 3 කින් උපසිරැසි හදාගන්න',
    step1Title: '1. මාධ්‍ය ගොනුව තෝරන්න',
    step1Desc: 'ඔබගේ MP4 හෝ MP3 ගොනුව Drag & Drop කරන්න. FFmpeg මඟින් ශ්‍රව්‍ය ධාවන පථය කෙළින්ම බ්‍රවුසරය තුළ වෙන්කර ගනී.',
    step2Title: '2. බ්‍රවුසරය තුළ AI පරිවර්තනය',
    step2Desc: 'Whisper AI ඔබගේ පරිගණකයේම ශ්‍රව්‍යය විශ්ලේෂණය කර තත්පර කිහිපයකින් නිවැරදි සිංහල අකුරු බවට පත් කරයි.',
    step3Title: '3. සකසා SRT බාගන්න',
    step3Desc: 'අවශ්‍ය පරිදි උපසිරැසි පෙළ සහ කාලරාමු සකස් කර එක් ක්ලික් එකකින් .SRT ගොනුව ලෙස බාගත කරගන්න.',
    
    faqTitle: 'නිතර අසන ප්‍රශ්න (FAQ)',
    faqs: [
      {
        question: 'CaptionLK සම්පූර්ණයෙන්ම නොමිලේද?',
        answer: 'ඔව්! CaptionLK 100% නොමිලේ සහ විවෘත මෘදුකාංගයක් (Open-Source) වේ. කිසිදු ගෙවීමක් හෝ දෛනික සීමා නොමැත.'
      },
      {
        question: 'මගේ වීඩියෝ හෝ ඕඩියෝ සර්වරයකට අප්ලෝඩ් වෙනවාද?',
        answer: 'කිසිසේත්ම නැත. CaptionLK ක්‍රියාත්මක වන්නේ ඔබේ බ්‍රවුසරය තුළ (Client-Side) පමණි. ඔබගේ ගොනු කිසිවිටෙකත් ඔබේ පරිගණකයෙන් පිටතට නොයයි.'
      },
      {
        question: 'සිංහල කථන හඳුනාගැනීම කෙතරම් නිවැරදිද?',
        answer: 'විශාල ශ්‍රව්‍ය දත්ත ප්‍රමාණයකින් පුහුණු කරන ලද OpenAI Whisper ආකෘතිය භාවිතා කරන බැවින් ඉතා පැහැදිලි සිංහල උපසිරැසි නිමාවක් ලබාදෙයි.'
      },
      {
        question: 'Offline (අන්තර්ජාලය නොමැතිව) මෙය භාවිතා කළ හැකිද?',
        answer: 'පළමු වර පිවිසීමේදී Whisper AI ආකෘතිය බාගත වී බ්‍රවුසරයේ ගබඩා වීමෙන් අනතුරුව, අන්තර්ජාල සම්බන්ධතාවයක් නොමැතිව වුවද භාවිතා කළ හැක.'
      }
    ],
    footerRights: 'CaptionLK. 100% නොමිලේ ක්ලයන්ට්-සයිඩ් AI සිංහල උපසිරැසි ජනකය.',
    madeWithLove: 'ශ්‍රී ලාංකේය වීඩියෝ නිර්මාණකරුවන් සහ සංස්කාරකවරුන් වෙනුවෙන් ආදරයෙන් නිපදවන ලදී.'
  }
};
