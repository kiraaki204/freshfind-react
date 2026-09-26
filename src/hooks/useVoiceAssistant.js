import { useCallback, useEffect, useRef, useState } from 'react';
import { chooseVoice, speechChunks, loadVoicePreferences } from '../utils/voice.js';

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const TTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
const ERRORS = {
  'not-allowed': 'Microphone access was blocked. Allow it in your browser settings, or type your question.',
  'service-not-allowed': 'Your browser has blocked speech recognition. You can still type your question.',
  'no-speech': 'No speech detected. Try again in a quieter place, or type your question.',
  'audio-capture': 'No microphone was found. Check your device input settings.',
  network: 'Speech recognition could not connect. Check your connection, or type instead.',
  aborted: null,
};

export default function useVoiceAssistant() {
  const [micState, setMicState] = useState('idle');
  const [micError, setMicError] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [voices, setVoices] = useState([]);
  const [preferences, setPreferences] = useState(loadVoicePreferences);
  const recRef = useRef(null);
  const micToken = useRef(0);
  const micTimer = useRef(null);
  const finishTimer = useRef(null);
  const finishRef = useRef(null);
  const speechToken = useRef(0);
  const speechIdRef = useRef(null);
  const utterRef = useRef(null); // retain the active utterance for browser GC

  useEffect(() => {
    try { localStorage.setItem('freshfind_voice', JSON.stringify(preferences)); } catch { /* private mode */ }
  }, [preferences]);

  useEffect(() => {
    if (!TTS) return undefined;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices() || []);
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(micTimer.current);
    clearTimeout(finishTimer.current);
  }, []);

  const cancelMic = useCallback(() => {
    ++micToken.current;
    clearTimers();
    const rec = recRef.current;
    recRef.current = null;
    finishRef.current = null;
    try { rec?.abort(); } catch { /* already stopped */ }
    setMicState('idle');
  }, [clearTimers]);

  const stopSpeak = useCallback(() => {
    ++speechToken.current;
    speechIdRef.current = null;
    utterRef.current = null;
    if (TTS) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const finishMic = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    clearTimeout(micTimer.current);
    setMicState('finishing');
    const finish = finishRef.current;
    // Some implementations don't dispatch onend after stop().
    finishTimer.current = setTimeout(() => { finish?.(); try { rec.abort(); } catch { /* stopped */ } }, 1500);
    try { rec.stop(); } catch { finish?.(); }
  }, []);

  const startMic = useCallback(({ onInterim, onFinal } = {}) => {
    if (!SR) { setMicError('Voice input is unavailable in this browser. You can type instead.'); return false; }
    cancelMic();
    stopSpeak(); // never transcribe the assistant's own voice
    const token = ++micToken.current;
    let transcript = '';
    let finished = false;
    let failed = false;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = preferences.language;
    rec.interimResults = true;
    rec.continuous = true; // don't cut off after the first short phrase
    rec.maxAlternatives = 3;
    const finish = () => {
      if (token !== micToken.current || finished) return;
      finished = true;
      clearTimers();
      recRef.current = null;
      finishRef.current = null;
      setMicState('idle');
      // Dictation is always a draft. The user reviews it before sending.
      if (transcript.trim()) onFinal?.(transcript.trim());
      else if (!failed) setMicError(ERRORS['no-speech']);
    };
    finishRef.current = finish;
    rec.onresult = (event) => {
      if (token !== micToken.current || finished) return;
      // Results contain the whole session: rebuild rather than duplicating
      // final words or discarding earlier phrases on subsequent callbacks.
      transcript = Array.from(event.results, (result) => result[0].transcript.trim()).join(' ');
      onInterim?.(transcript);
    };
    rec.onerror = (event) => {
      if (token !== micToken.current || finished) return;
      failed = true;
      setMicError(ERRORS[event.error] ?? (event.error === 'aborted' ? null : 'Voice input stopped. Please try again.'));
      finish();
    };
    rec.onend = finish;
    setMicError(null);
    setMicState('listening');
    try {
      rec.start();
      micTimer.current = setTimeout(finishMic, 60000);
      return true;
    } catch {
      failed = true;
      setMicError('Voice input could not start. Please try again.');
      finish();
      return false;
    }
  }, [cancelMic, stopSpeak, preferences.language, clearTimers, finishMic]);

  const speak = useCallback((id, text) => {
    if (!TTS || recRef.current) return;
    stopSpeak();
    const chunks = speechChunks(text);
    if (!chunks.length) return;
    const token = speechToken.current;
    const synth = window.speechSynthesis;
    const voice = chooseVoice(synth.getVoices(), preferences.language, preferences.voiceURI);
    speechIdRef.current = id;
    setMicError(null);
    setSpeakingId(id);
    const done = () => {
      if (token !== speechToken.current) return;
      speechIdRef.current = null;
      utterRef.current = null;
      setSpeakingId(null);
    };
    const play = (index) => {
      if (token !== speechToken.current) return;
      if (index >= chunks.length) { done(); return; }
      const utter = new SpeechSynthesisUtterance(chunks[index]);
      utterRef.current = utter;
      utter.voice = voice;
      utter.lang = voice?.lang || preferences.language;
      utter.rate = preferences.rate;
      utter.pitch = 1;
      utter.onend = () => play(index + 1);
      utter.onerror = (event) => {
        if (token !== speechToken.current) return;
        if (!['canceled', 'interrupted'].includes(event.error)) setMicError('Read-aloud is unavailable for this voice. Try another voice in Voice settings.');
        done();
      };
      try { synth.speak(utter); } catch { done(); setMicError('Read-aloud could not start. Try another voice.'); }
    };
    play(0);
  }, [stopSpeak, preferences]);

  const toggleSpeak = useCallback((id, text) => {
    if (speechIdRef.current === id) stopSpeak();
    else speak(id, text);
  }, [speak, stopSpeak]);
  const stopAll = useCallback(() => { cancelMic(); stopSpeak(); }, [cancelMic, stopSpeak]);
  useEffect(() => stopAll, [stopAll]);

  const updatePreferences = (patch) => {
    stopAll();
    setPreferences((old) => ({ ...old, ...patch }));
  };
  return {
    micSupported: Boolean(SR), ttsSupported: TTS,
    micState, micError, clearMicError: () => setMicError(null),
    startMic, finishMic, cancelMic, speakingId, speak, toggleSpeak, stopSpeak, stopAll,
    voices: voices.filter((v) => /^en(?:[-_]|$)/i.test(v.lang)), preferences, updatePreferences,
  };
}
