import { useCallback, useEffect, useRef, useState } from 'react';

/* Voice interaction for the FreshFind Assistant.
   Speech-to-text uses the browser's native Web Speech API
   (SpeechRecognition / webkitSpeechRecognition); spoken replies use
   speechSynthesis + SpeechSynthesisUtterance. Both degrade gracefully:
   when an API is unavailable the hook reports it and the chat keeps
   working as a plain text chatbot.

   All listening is started by an explicit user action (mic button) and
   speech playback is user-controlled (per-message Listen buttons plus an
   optional "read new replies" toggle in the chat header). */

const SR = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;
const TTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

const EMOJI_RE = /[\p{Extended_Pictographic}️]/gu;
const cleanForSpeech = (text) =>
  (text || '')
    .replace(EMOJI_RE, ' ')
    .replace(/[•·]/g, ', ')
    .replace(/→/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

/* Splitting the reply into short sentence chunks and chaining one utterance
   after another sounds far more natural than one robotic mega-utterance —
   and it also avoids the long-text cut-off bug in some browsers. */
const toSpeechChunks = (text) => {
  const cleaned = cleanForSpeech(text);
  if (!cleaned) return [];
  // sentinel split (no lookbehind — Safari-safe)
  const parts = cleaned.replace(/([.!?…,;:])\s+/g, '$1\u0001').split('\u0001');
  const chunks = [];
  let buf = '';
  for (const part of parts) {
    const p = part.trim();
    if (!p) continue;
    if ((buf + ' ' + p).trim().length > 140) { if (buf) chunks.push(buf.trim()); buf = p; }
    else buf = (buf + ' ' + p).trim();
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
};

/* Voice quality varies WILDLY between browsers. Prefer the natural/neural
   online voices (Edge) or Google's English pack (Chrome), then any English
   voice, then the browser default — never lock onto a random first entry. */
const pickVoice = (voices) => {
  const english = voices.filter((v) => /^en\b/i.test(v.lang || ''));
  const pool = english.length ? english : voices;
  const score = (v) => {
    const n = `${v.name || ''} ${v.lang || ''}`.toLowerCase();
    let s = 0;
    if (/natural|neural|online/.test(n)) s += 40;
    if (/google/.test(n)) s += (n.includes('us') ? 34 : 26);
    if (/samantha|aria|jenny|zira|sonia|libby|daniel|karen|moira|tessa/.test(n)) s += 22;
    if (/en[-_]us/.test(n)) s += 12;
    else if (/en[-_]gb|en[-_]au|en[-_]ca/.test(n)) s += 8;
    if (v.default) s += 6;
    if (v.localService) s += 2;
    return s;
  };
  return pool.slice().sort((a, b) => score(b) - score(a))[0] || null;
};

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access was blocked. Allow mic permission in your browser and try again.',
  'service-not-allowed': 'Microphone access was blocked. Allow mic permission in your browser and try again.',
  'no-speech': 'No speech was detected — tap the mic and try speaking a little louder.',
  'audio-capture': 'No microphone was found on this device.',
  network: 'The speech service is unreachable right now. Check your connection.',
  aborted: null, // user-initiated cancel — not an error
};

export default function useVoiceAssistant() {
  const [micState, setMicState] = useState('idle'); // idle | listening
  const [micError, setMicError] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  const recRef = useRef(null);
  const tokenRef = useRef(0); // invalidates handlers of stale sessions
  const finalSentRef = useRef(false);
  const cancelledRef = useRef(false);
  const speechIdRef = useRef(null);
  const queueRef = useRef([]);
  const voicesRef = useRef([]);

  /* keep the TTS voice list warm */
  useEffect(() => {
    if (!TTS) return undefined;
    const synth = window.speechSynthesis;
    const load = () => { voicesRef.current = synth.getVoices() || []; };
    load();
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', load);
      return () => synth.removeEventListener('voiceschanged', load);
    }
    synth.onvoiceschanged = load;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  /* ------------------------------------------------ speech-to-text */
  const cancelMic = useCallback(() => {
    if (!recRef.current) return;
    cancelledRef.current = true;
    tokenRef.current += 1; // silence callbacks from the aborted session
    try { recRef.current.abort(); } catch { /* already stopped */ }
    recRef.current = null;
    setMicState('idle');
  }, []);

  const startMic = useCallback(({ onInterim, onFinal } = {}) => {
    if (!SR) {
      setMicError('Voice input is not supported in this browser.');
      return false;
    }
    cancelMic(); // never run two recognition sessions at once

    const token = ++tokenRef.current;
    finalSentRef.current = false;
    cancelledRef.current = false;

    const rec = new SR();
    recRef.current = rec;
    // the assistant speaks English — an explicit English grammar is far more
    // reliable than whatever locale the browser was configured with
    rec.lang = /^en/i.test(navigator.language || '') ? navigator.language : 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      if (token !== tokenRef.current) return;
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim && !final) onInterim?.(interim.replace(/^\s+/, ''));
      if (final && !finalSentRef.current) {
        finalSentRef.current = true; // exactly one submission per session
        onFinal?.(final.trim());
      }
    };
    rec.onerror = (e) => {
      if (token !== tokenRef.current) return;
      const msg = Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, e.error)
        ? ERROR_MESSAGES[e.error]
        : `Voice input hiccup (${e.error}). Please try again.`;
      if (msg && !cancelledRef.current) setMicError(msg);
      setMicState('idle');
    };
    rec.onend = () => {
      if (token !== tokenRef.current) return;
      recRef.current = null;
      setMicState('idle');
      if (!finalSentRef.current && !cancelledRef.current) {
        setMicError((prev) => prev ?? 'No speech detected — tap the mic to try again.');
      }
    };

    setMicError(null);
    setMicState('listening');
    try {
      rec.start();
    } catch {
      recRef.current = null;
      setMicState('idle');
      setMicError('Voice input could not start. Please try again.');
      return false;
    }
    return true;
  }, [cancelMic]);

  /* ------------------------------------------------ text-to-speech */
  const stopSpeak = useCallback(() => {
    if (TTS) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
    speechIdRef.current = null;
    queueRef.current = [];
    setSpeakingId(null);
  }, []);

  const speak = useCallback((id, text) => {
    if (!TTS) return;
    stopSpeak(); // only ever one spoken message at a time
    const chunks = toSpeechChunks(text);
    if (!chunks.length) return;
    const synth = window.speechSynthesis;
    // refresh lazily — some browsers only fill voices after first use
    const voices = voicesRef.current.length ? voicesRef.current : synth.getVoices();
    const voice = pickVoice(voices);

    speechIdRef.current = id;
    setSpeakingId(id);
    let i = 0;
    const finish = () => {
      if (speechIdRef.current === id) {
        speechIdRef.current = null;
        setSpeakingId(null);
      }
    };
    const next = () => {
      // a different playback took over (or the user hit Stop) — abandon queue
      if (speechIdRef.current !== id) return;
      if (i >= chunks.length) { finish(); return; }
      const u = new SpeechSynthesisUtterance(chunks[i]);
      if (voice) u.voice = voice;
      u.rate = 0.96;  // conversational, unhurried — clearer than 1.0+
      u.pitch = 1.02; // a touch warmer
      u.onend = () => { i += 1; next(); };
      u.onerror = finish;
      try { synth.speak(u); } catch { finish(); }
    };
    next();
  }, [stopSpeak]);

  const toggleSpeak = useCallback((id, text) => {
    if (speechIdRef.current === id) stopSpeak();
    else speak(id, text);
  }, [speak, stopSpeak]);

  const stopAll = useCallback(() => { cancelMic(); stopSpeak(); }, [cancelMic, stopSpeak]);

  /* release the mic + speaker when the component unmounts */
  useEffect(() => stopAll, [stopAll]);

  return {
    micSupported: Boolean(SR),
    ttsSupported: TTS,
    micState,
    micError,
    clearMicError: () => setMicError(null),
    startMic,
    cancelMic,
    speakingId,
    speak,
    toggleSpeak,
    stopSpeak,
    stopAll,
  };
}
