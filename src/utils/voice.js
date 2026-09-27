import { readJSON } from './storage.js';

// Keep display copy intact; make only the spoken version easier to pronounce.
export function cleanForSpeech(text = '') {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/\bFreshFind\b/gi, 'Fresh Find')
    .replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, (_, h, m, period) =>
      `${Number(h)}${m === '00' ? '' : Number(m) < 10 ? ` oh ${Number(m)}` : ` ${m}`} ${period.toUpperCase().split('').join(' ')}`)
    .replace(/\bkm\b/gi, 'kilometres')
    .replace(/\s*[–—]\s*/g, ', ')
    .replace(/&/g, ' and ')
    .replace(/[•·|]/g, '. ')
    .replace(/[*_#`]/g, '')
    .replace(/\n+/g, '. ')
    .replace(/(?:\.\s*){2,}/g, '. ')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// Prefer a natural English voice over an arbitrary system default (which
// may be in a completely different language). Availability is OS-dependent.
export function chooseVoice(voices, language, preferredURI = '') {
  const english = voices.filter((v) => /^en(?:[-_]|$)/i.test(v.lang));
  const saved = english.find((v) => v.voiceURI === preferredURI);
  if (saved) return saved;
  const score = (v) =>
    (v.lang.toLowerCase().replace('_', '-') === language.toLowerCase() ? 100 : 0) +
    (/natural|neural|premium|enhanced/i.test(v.name) ? 40 : 0) +
    (/google|samantha|aria|jenny|guy|daniel/i.test(v.name) ? 20 : 0) +
    (!v.localService ? 5 : 0) + (v.default ? 1 : 0);
  return [...english].sort((a, b) => score(b) - score(a))[0] || null;
}

// Short, sentence-aware utterances avoid long-text truncation in browsers.
export function speechChunks(text, maxLength = 220) {
  const sentences = cleanForSpeech(text).split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.flatMap((sentence) => {
    const chunks = [];
    let current = '';
    for (const word of sentence.trim().split(/\s+/)) {
      if (current && current.length + word.length + 1 > maxLength) {
        chunks.push(current);
        current = '';
      }
      current += `${current ? ' ' : ''}${word}`;
    }
    if (current) chunks.push(current);
    return chunks;
  });
}

export const VOICE_LANGUAGES = [
  ['en-US', 'English · US'], ['en-GB', 'English · UK'],
  ['en-AU', 'English · Australia'], ['en-IN', 'English · India'],
];

export function loadVoicePreferences() {
  const fallback = { language: 'en-US', voiceURI: '', rate: 1 };
  const saved = readJSON('freshfind_voice', {});
  return {
    language: VOICE_LANGUAGES.some(([code]) => code === saved.language) ? saved.language :
      VOICE_LANGUAGES.some(([code]) => code === navigator.language) ? navigator.language : fallback.language,
    voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : '',
    rate: typeof saved.rate === 'number' && saved.rate >= .8 && saved.rate <= 1.2 ? saved.rate : 1,
  };
}
