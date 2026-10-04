/**
 * Singlish (Phonetic English) to Sinhala Unicode Transliteration Engine
 * Converts Singlish (e.g. "ayubowan", "mama gedara yanawa", "suba udasanak")
 * into authentic Sinhala Unicode letters ("ආයුබෝවන්", "මම ගෙදර යනවා", "සුබ උදෑසනක්").
 */

// Special letter combinations
const specialWords: Record<string, string> = {
  'ayubowan': 'ආයුබෝවන්',
  'aayubowan': 'ආයුබෝවන්',
  'sthuthiyi': 'ස්තූතියි',
  'sthuthi': 'ස්තූතියි',
  'kohomada': 'කොහොමද',
  'suba': 'සුබ',
  'udasanak': 'උදෑසනක්',
  'sandhawak': 'සන්ධ්‍යාවක්',
  'rathriyak': 'රාත්‍රියක්',
  'sinhala': 'සිංහල',
  'sinhalata': 'සිංහලට',
  'lanka': 'ලංකා',
  'srilanka': 'ශ්‍රී ලංකා',
  'captionlk': 'CaptionLK',
  'karanna': 'කරන්න',
  'karanawa': 'කරනවා',
  'hondai': 'හොඳයි',
  'hari': 'හරි',
  'ow': 'ඔව්',
  'ne': 'නෑ',
  'nahe': 'නැහැ',
  'puluwan': 'පුළුවන්',
  'ba': 'බෑ',
  'bahe': 'බැහැ'
};

// Independent Vowels
const vowels: Record<string, string> = {
  'aae': 'ඈ',
  'aee': 'ඈ',
  'ae': 'ඇ',
  'aa': 'ආ',
  'a': 'අ',
  'A': 'ආ',
  'ii': 'ඊ',
  'ee': 'ඊ',
  'i': 'ඉ',
  'I': 'ඊ',
  'uu': 'ඌ',
  'oo': 'ඌ',
  'u': 'උ',
  'U': 'ඌ',
  'ea': 'ඒ',
  'ei': 'ඒ',
  'e': 'එ',
  'E': 'ඒ',
  'oa': 'ඕ',
  'oe': 'ඕ',
  'o': 'ඔ',
  'O': 'ඕ',
  'au': 'ඖ',
  'ou': 'ඖ',
  'ai': 'අයි'
};

// Dependent Vowel Signs (Pili)
const vowelSigns: Record<string, string> = {
  'aae': 'ෑ',
  'aee': 'ෑ',
  'ae': 'ැ',
  'aa': 'ා',
  'a': '',
  'A': 'ා',
  'ii': 'ී',
  'ee': 'ී',
  'i': 'ි',
  'I': 'ී',
  'uu': 'ූ',
  'oo': 'ූ',
  'u': 'ු',
  'U': 'ූ',
  'ea': 'ේ',
  'ei': 'ේ',
  'e': 'ෙ',
  'E': 'ේ',
  'oa': 'ෝ',
  'oe': 'ෝ',
  'o': 'ො',
  'O': 'ෝ',
  'au': 'ෞ',
  'ou': 'ෞ',
  'ai': 'යි'
};

// Consonants table (longest matches first)
const consonants: Array<[string, string]> = [
  ['shri', 'ශ්‍රී'],
  ['shree', 'ශ්‍රී'],
  ['sri', 'ශ්‍රී'],
  ['nndh', 'ඳ'],
  ['nnd', 'ඬ'],
  ['nng', 'ඟ'],
  ['mmb', 'ඹ'],
  ['ch', 'ච'],
  ['Ch', 'ඡ'],
  ['sh', 'ශ'],
  ['Sh', 'ෂ'],
  ['th', 'ත'],
  ['Th', 'ථ'],
  ['dh', 'ද'],
  ['Dh', 'ධ'],
  ['kh', 'ඛ'],
  ['gh', 'ඝ'],
  ['jh', 'ඣ'],
  ['ph', 'ෆ'],
  ['bh', 'භ'],
  ['ny', 'ඤ'],
  ['kn', 'ඥ'],
  ['gn', 'ඥ'],
  ['ng', 'ං'],
  ['mb', 'ඹ'],
  ['nd', 'ඳ'],
  ['k', 'ක'],
  ['g', 'ග'],
  ['t', 'ත'],
  ['T', 'ට'],
  ['d', 'ද'],
  ['D', 'ඩ'],
  ['n', 'න'],
  ['N', 'ණ'],
  ['p', 'ප'],
  ['b', 'බ'],
  ['m', 'ම'],
  ['y', 'ය'],
  ['r', 'ර'],
  ['l', 'ල'],
  ['L', 'ළ'],
  ['v', 'ව'],
  ['w', 'ව'],
  ['s', 'ස'],
  ['h', 'හ'],
  ['f', 'ෆ'],
  ['j', 'ජ']
];

/**
 * Transliterates a single Singlish word into Sinhala letters
 */
export function singlishWordToSinhala(word: string): string {
  if (!word) return '';

  const cleanWord = word.trim();
  const lower = cleanWord.toLowerCase();

  // If already contains Sinhala Unicode characters (0x0D80 to 0x0DFF), leave it alone!
  if (/[\u0D80-\u0DFF]/.test(cleanWord)) {
    return cleanWord;
  }

  // Check dictionary of special words
  if (specialWords[lower]) {
    return specialWords[lower];
  }

  // If word is pure punctuation or number
  if (/^[0-9\W_]+$/.test(cleanWord)) {
    return cleanWord;
  }

  let result = '';
  let i = 0;
  const len = cleanWord.length;

  while (i < len) {
    const char = cleanWord[i];

    // Non-alphabet characters
    if (!/[a-zA-Z]/.test(char)) {
      result += char;
      i++;
      continue;
    }

    // Try matching consonants
    let matchedConsonant = '';
    let sinhalaConsonant = '';
    for (const [key, val] of consonants) {
      if (cleanWord.substring(i, i + key.length).toLowerCase() === key.toLowerCase()) {
        matchedConsonant = key;
        sinhalaConsonant = val;
        break;
      }
    }

    if (matchedConsonant) {
      i += matchedConsonant.length;

      // Now check following vowel
      let matchedVowel = '';
      let vowelPilla = '';

      // Check multi-char vowels first ('aae', 'ae', 'aa', 'ii', 'uu', 'ee', 'oo', 'au', 'ai')
      const sub3 = cleanWord.substring(i, i + 3).toLowerCase();
      const sub2 = cleanWord.substring(i, i + 2).toLowerCase();
      const sub1 = cleanWord.substring(i, i + 1).toLowerCase();

      if (vowelSigns[sub3] !== undefined) {
        matchedVowel = sub3;
        vowelPilla = vowelSigns[sub3];
      } else if (vowelSigns[sub2] !== undefined) {
        matchedVowel = sub2;
        vowelPilla = vowelSigns[sub2];
      } else if (vowelSigns[sub1] !== undefined) {
        matchedVowel = sub1;
        vowelPilla = vowelSigns[sub1];
      }

      if (matchedVowel) {
        // Has a vowel following the consonant
        result += sinhalaConsonant + vowelPilla;
        i += matchedVowel.length;
      } else {
        // No vowel follows -> Hal kurura (virama / ්)
        // Exception: if followed by 'y' or 'r', handle yansaya/rakaransaya or hal
        if (i < len && cleanWord[i].toLowerCase() === 'y') {
          result += sinhalaConsonant + '්ය';
          i++;
        } else if (i < len && cleanWord[i].toLowerCase() === 'r') {
          result += sinhalaConsonant + '්‍ර';
          i++;
        } else {
          result += sinhalaConsonant + '්';
        }
      }
      continue;
    }

    // Try independent vowels at start of syllable
    let matchedIndepVowel = '';
    let sinhalaIndepVowel = '';
    const vsub3 = cleanWord.substring(i, i + 3).toLowerCase();
    const vsub2 = cleanWord.substring(i, i + 2).toLowerCase();
    const vsub1 = cleanWord.substring(i, i + 1).toLowerCase();

    if (vowels[vsub3]) {
      matchedIndepVowel = vsub3;
      sinhalaIndepVowel = vowels[vsub3];
    } else if (vowels[vsub2]) {
      matchedIndepVowel = vsub2;
      sinhalaIndepVowel = vowels[vsub2];
    } else if (vowels[vsub1]) {
      matchedIndepVowel = vsub1;
      sinhalaIndepVowel = vowels[vsub1];
    }

    if (matchedIndepVowel) {
      result += sinhalaIndepVowel;
      i += matchedIndepVowel.length;
      continue;
    }

    // Default fallback
    result += char;
    i++;
  }

  return result;
}

/**
 * Transliterates an entire text paragraph from Singlish to Sinhala Unicode letters.
 * Preserves URLs, English brand names (CaptionLK, YouTube), numbers, and punctuation.
 */
export function singlishToSinhala(text: string): string {
  if (!text) return '';

  // Don't modify if already mostly Sinhala
  const sinhalaChars = (text.match(/[\u0D80-\u0DFF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  if (sinhalaChars > 0 && sinhalaChars >= latinChars) {
    return text;
  }

  // Split by words while keeping delimiters
  return text
    .split(/(\s+|[.,!?;:()\[\]"'])/)
    .map(token => {
      // If token is whitespace or punctuation
      if (/^(\s+|[.,!?;:()\[\]"'])$/.test(token)) {
        return token;
      }
      // Preserve known English technical words
      if (/^(https?:\/\/|www\.|CaptionLK|SRT|VTT|MP4|MP3|AI|Whisper|YouTube|DaVinci|CapCut)/i.test(token)) {
        return token;
      }
      return singlishWordToSinhala(token);
    })
    .join('');
}
