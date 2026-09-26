import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marketsData from '../data/markets.json';
import { getReply, emptyContext, welcomeMessage } from '../chatbot/engine.js';
import { visibleMarkets } from '../utils/geo.js';
import { applyMarketFilters } from '../utils/markets.js';
import { imgPath } from '../utils/markets.js';
import { useChat } from '../hooks/useChat.jsx';
import { useBookmarks } from '../hooks/useBookmarks.jsx';
import { useGeolocation } from '../hooks/useGeolocation.jsx';
import { useDirectoryFilters } from '../hooks/useDirectoryFilters.jsx';
import { useProduceFilters } from '../hooks/useProduceFilters.jsx';
import { useMarketModal } from '../hooks/useMarketModal.jsx';
import { useProduceDetailModal } from '../hooks/useProduceDetailModal.jsx';
import { useSupportModal } from '../hooks/useSupportModal.jsx';
import useVoiceAssistant from '../hooks/useVoiceAssistant.js';
import { VOICE_LANGUAGES } from '../utils/voice.js';
import Icon from './Icon.jsx';

const CHAT_KEY = 'freshfind_chat';
const HINT_KEY = 'freshfind_chat_hint';

/* saved items are a modal ('saved'), not a route — handled specially below.
   The About story lives in the homepage Field Journal and the produce guide
   in the homepage produce section — no standalone pages exist for either. */
const PAGE_ROUTES = {
  home: '/',
  directory: '/markets',
  produce: '/#produce',
  about: '/#journal',
  contact: '/#contact',
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const timeLabel = (d) =>
  new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function loadMessages() {
  try {
    const stored = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
    if (Array.isArray(stored) && stored.length) {
      return stored.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
  } catch {
    /* corrupted storage — start fresh */
  }
  return [];
}

export default function ChatWidget() {
  const { open, openChat } = useChat();
  const navigate = useNavigate();
  const bookmarks = useBookmarks();
  const geoCtx = useGeolocation();
  const dirFilters = useDirectoryFilters();
  const produceFilters = useProduceFilters();
  const { openMarket: openMarketModal } = useMarketModal();
  const { openProduce: openProduceModal } = useProduceDetailModal();
  const { openSupport } = useSupportModal();

  /* voice interaction — native Web Speech APIs, gracefully degrading */
  const {
    micSupported, ttsSupported,
    micState, micError, clearMicError, startMic, finishMic, cancelMic,
    speakingId, toggleSpeak, speak, stopSpeak, stopAll,
    voices, preferences, updatePreferences,
  } = useVoiceAssistant();
  const [autoSpeak, setAutoSpeak] = useState(false);
  const autoSpeakRef = useRef(false);
  const speakRef = useRef(speak);
  speakRef.current = speak;

  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
    if (!autoSpeak) stopSpeak();
  }, [autoSpeak, stopSpeak]);

  const [msgs, setMsgs] = useState(loadMessages);
  const [typing, setTyping] = useState(false);
  const [ctx, setCtx] = useState(emptyContext);
  const [input, setInput] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  const msgsBoxRef = useRef(null);
  const inputRef = useRef(null);

  /* latest context values, readable from delayed/async engine callbacks */
  const live = useRef({});
  live.current = { bookmarks, geoCtx, dirFilters, produceFilters };

  /* The agent is how the engine acts on the site — navigation, filters,
     bookmarks, location, map. Everything delegates to real app state. */
  const buildAgent = () => {
    const { bookmarks: bm, geoCtx: geo, dirFilters: dir, produceFilters: prod } = live.current;
    const user = () =>
      geo.geo.granted && geo.geo.lat != null ? { lat: geo.geo.lat, lng: geo.geo.lng } : null;

    return {
      openPage: (page) => {
        if (page === 'bookmarks') { openSupport('saved'); return; }
        navigate(PAGE_ROUTES[page] ?? '/');
      },
      openMarket: (m) => { openMarketModal(m.id); openChat(false); },
      openProduce: (p) => openProduceModal(p.id),
      openProduceGuide: (opts = {}) => {
        prod.replace(opts);
        navigate('/#produce');
      },
      openDirectory: (search) => {
        dir.update({ area: '', day: '', produce: '', search: search || '' });
        navigate('/markets');
      },
      openMapView: (marketId) => {
        dir.update({ view: 'map' });
        if (marketId != null) dir.requestMapPopup(marketId);
        navigate('/markets');
        const filtered = applyMarketFilters(marketsData, dir.filters, geo.geo);
        return visibleMarkets(filtered, user()).displayed.length;
      },
      userLocation: user,
      locate: (done) => geo.locate(done),
      bookmarkCount: () => bm.bookmarks.length,
      saveItem: (item) => {
        if (bm.isBookmarked(item.id)) return 'already';
        bm.toggleBookmark(item);
        return 'saved';
      },
      unsaveItem: (item) => {
        if (!bm.isBookmarked(item.id)) return 'not-saved';
        bm.toggleBookmark(item);
        return 'removed';
      },
    };
  };

  /* persist conversation (last 60 messages) */
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(msgs.slice(-60)));
    } catch {
      /* ignore */
    }
  }, [msgs]);

  /* hint bubble after a few seconds, only if never seen */
  useEffect(() => {
    const t = setTimeout(() => {
      if (open) return;
      try {
        if (localStorage.getItem(HINT_KEY) === 'seen') return;
      } catch {
        /* ignore */
      }
      setHintVisible(true);
    }, 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* opening the panel: hide hint, greet on first open, focus the input */
  useEffect(() => {
    if (!open) return;
    setHintVisible(false);
    try {
      localStorage.setItem(HINT_KEY, 'seen');
    } catch {
      /* ignore */
    }
    setMsgs((m) => {
      if (m.length) return m;
      const w = welcomeMessage();
      return [{ id: 'welcome', sender: 'bot', text: w.text, suggestions: w.suggestions, timestamp: new Date() }];
    });
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open]);

  /* Escape closes the panel */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') openChat(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, openChat]);

  /* closing the panel always releases the mic and stops playback */
  useEffect(() => {
    if (!open) stopAll();
  }, [open, stopAll]);

  /* no auto-scroll: the reader stays in control of the message list */

  const sendChat = (raw) => {
    const text = (raw || '').trim();
    if (!text || typing) return;
    cancelMic();
    stopSpeak();
    clearMicError();
    const ctxAtSend = ctx;
    setMsgs((m) => [...m, { id: uid(), sender: 'user', text, timestamp: new Date() }]);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setTyping(true);

    const think = 450 + Math.min(text.length * 12, 700);
    setTimeout(() => {
      const out = getReply(text, ctxAtSend, buildAgent());
      const apply = (o) => {
        const botId = uid();
        setCtx(o.ctx);
        setMsgs((m) => [
          ...m,
          {
            id: botId,
            sender: 'bot',
            text: o.reply.text,
            cards: o.reply.cards,
            suggestions: o.reply.suggestions,
            links: o.reply.links,
            timestamp: new Date(),
          },
        ]);
        setTyping(false);
        // voice output is user-controlled: replies are only auto-spoken
        // while the "read replies aloud" toggle is on
        if (autoSpeakRef.current) speakRef.current(botId, o.reply.text);
      };
      if (out && typeof out.then === 'function') out.then(apply);
      else apply(out);
    }, think);
  };

  /* mic button: start listening, cancel, or report unsupported browsers */
  const onMic = () => {
    if (!micSupported) {
      clearMicError();
      return;
    }
    if (micState === 'listening') {
      finishMic();
      return;
    }
    clearMicError();
    stopSpeak(); // never talk over the user's own question
    const draft = input.trim();
    const updateDraft = (text) => setInput([draft, text].filter(Boolean).join(' '));
    startMic({
      onInterim: updateDraft,
      onFinal: (text) => {
        updateDraft(text);
        inputRef.current?.focus();
      },
    });
  };

  const clearChat = () => {
    stopAll();
    clearMicError();
    setCtx(emptyContext());
    const w = welcomeMessage();
    setMsgs([{ id: 'welcome', sender: 'bot', text: w.text, suggestions: w.suggestions, timestamp: new Date() }]);
  };

  const openItem = (type, id) => {
    if (type === 'market') openMarketModal(Number(id));
    else openProduceModal(id);
    openChat(false);
  };

  const followLink = (page) => {
    if (page === 'bookmarks') { openSupport('saved'); openChat(false); return; }
    const to = PAGE_ROUTES[page] ?? '/';
    navigate(to);
    if (!to.includes('#')) window.scrollTo({ top: 0, behavior: 'smooth' });
    openChat(false);
  };

  const autoResize = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 76)}px`;
  };

  const last = msgs.length - 1;

  return (
    <>
      <div className={`chat-panel${open ? ' open' : ''}`} role="dialog" aria-label="FreshFind Assistant">
        <div className="chat-head">
          <div className="d-flex align-items-center gap-2">
            <div
              className="position-relative d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 32, height: 32, background: 'rgba(255,255,255,.2)' }}
            >
              <Icon name="leaf" size={18} />
              <span
                className="position-absolute"
                style={{ bottom: -2, right: -2, width: 10, height: 10, background: '#86efac', border: '2px solid #15803d', borderRadius: '50%' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>FreshFind Assistant</div>
              <div style={{ fontSize: 10, color: '#bbf7d0', lineHeight: 1.2 }}>
                {typing ? 'typing…' : `Online · knows all ${marketsData.length} markets`}
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {ttsSupported && (
              <button
                className="icon-btn text-white"
                aria-label={autoSpeak ? 'Turn off read-aloud for new replies' : 'Turn on read-aloud for new replies'}
                aria-pressed={autoSpeak}
                title="Read new replies aloud"
                style={autoSpeak ? { background: 'rgba(255,255,255,.25)', borderRadius: 8 } : undefined}
                onClick={() => setAutoSpeak((s) => !s)}
              >
                <Icon name={autoSpeak ? 'volume' : 'volumeOff'} size={14} />
              </button>
            )}
            <button className="icon-btn text-white" aria-label="Clear conversation" onClick={clearChat}>
              <Icon name="trash" size={14} />
            </button>
            <button className="icon-btn text-white" aria-label="Close chat" onClick={() => openChat(false)}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        <details className="voice-settings">
          <summary>Voice settings <span>Accent, voice &amp; pace</span></summary>
          <div className="voice-settings-body">
            <label htmlFor="voice-language">Listening accent</label>
            <select id="voice-language" value={preferences.language} onChange={(e) => updatePreferences({ language: e.target.value, voiceURI: '' })}>
              {VOICE_LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
            {ttsSupported && <>
              <label htmlFor="voice-choice">Speaking voice</label>
              <select id="voice-choice" value={voices.some((v) => v.voiceURI === preferences.voiceURI) ? preferences.voiceURI : ''} onChange={(e) => updatePreferences({ voiceURI: e.target.value })}>
                <option value="">Automatic · best available English voice</option>
                {voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
              </select>
              <label htmlFor="voice-rate">Speaking pace · {preferences.rate.toFixed(2)}×</label>
              <input id="voice-rate" type="range" min="0.8" max="1.2" step="0.05" value={preferences.rate} onChange={(e) => updatePreferences({ rate: Number(e.target.value) })} />
              <button type="button" className="voice-preview" onClick={() => toggleSpeak('voice-preview', 'Hi, I’m your FreshFind assistant. Where would you like to explore today?')}>
                {speakingId === 'voice-preview' ? 'Stop preview' : 'Preview voice'}
              </button>
            </>}
            <p>Voices depend on your browser and device. Dictated text stays editable until you send it. Your browser may process speech online.</p>
            {!micSupported && <p>Voice input is not supported here. You can still type your question.</p>}
            {!ttsSupported && <p>Read-aloud is not supported in this browser.</p>}
          </div>
        </details>

        <div className="position-relative flex-grow-1" style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="chat-msgs" ref={msgsBoxRef} aria-live="polite">
            {msgs.map((msg, i) => (
              <div key={msg.id} className={`d-flex gap-1 mb-2${msg.sender === 'user' ? ' justify-content-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1"
                    style={{ width: 20, height: 20, background: '#16a34a', color: '#fff' }}
                  >
                    <Icon name="leaf" size={10} />
                  </div>
                )}
                <div style={{ maxWidth: '86%' }}>
                  <div className={`bubble ${msg.sender}`}>{msg.text}</div>

                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-1 d-flex flex-column gap-1">
                      {msg.cards.map((c, ci) => (
                        <button key={ci} className="chat-card" onClick={() => openItem(c.type, c.id)}>
                          <img
                            src={imgPath(c.image)}
                            alt=""
                            style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6' }}
                          />
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center gap-1">
                              <span className="fw-semibold text-truncate" style={{ fontSize: 11 }}>{c.title}</span>
                              {c.badge && (
                                <span
                                  className={`chip ${c.badge.indexOf('Open') !== -1 ? 'status-open' : 'status-soon'}`}
                                  style={{ fontSize: 9 }}
                                >
                                  {c.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-muted text-truncate" style={{ fontSize: 10 }}>{c.subtitle}</div>
                            <div className="text-truncate" style={{ fontSize: 9.5, color: '#15803d' }}>{c.meta}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-1 d-flex flex-wrap gap-1">
                      {msg.links.map((l, li) => (
                        <button key={li} className="page-link-chip" onClick={() => followLink(l.page)}>
                          {l.label} →
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && i === last && (
                    <div className="mt-1 d-flex flex-wrap gap-1">
                      {msg.suggestions.map((s) => (
                        <button key={s} className="sug" onClick={() => sendChat(s)}>{s}</button>
                      ))}
                    </div>
                  )}

                  <div
                    className="text-muted d-flex align-items-center gap-1"
                    style={{ fontSize: 9, ...(msg.sender === 'user' ? { textAlign: 'right' } : {}) }}
                  >
                    {timeLabel(msg.timestamp)}
                    {msg.sender === 'bot' && ttsSupported && (
                      <button
                        type="button"
                        className={`msg-speak${speakingId === msg.id ? ' playing' : ''}`}
                        aria-label={speakingId === msg.id ? 'Stop reading this reply' : `Listen to the reply: ${msg.text.slice(0, 60)}`}
                        onClick={() => toggleSpeak(msg.id, msg.text)}
                      >
                        <Icon name={speakingId === msg.id ? 'stop' : 'volume'} size={11} />
                        {speakingId === msg.id ? 'Stop' : 'Listen'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="d-flex gap-1">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 20, height: 20, background: '#16a34a', color: '#fff' }}
                >
                  <Icon name="leaf" size={10} />
                </div>
                <div className="bubble bot">
                  <span className="dots"><span /> <span /> <span /></span>
                </div>
              </div>
            )}
          </div>
          <button className="jump-latest" hidden aria-label="Scroll to latest message">
            <Icon name="arrow-down" size={12} />
          </button>
        </div>

        {(micState !== 'idle' || micError || speakingId) && (
          <div
            className={`voice-status${micState === 'listening' ? ' listening' : ''}${micError ? ' has-error' : ''}`}
            role="status"
            aria-live="polite"
          >
            {micState !== 'idle' && (
              <>
                <span className="voice-pulse" aria-hidden="true" />
                <span className="flex-grow-1">{micState === 'finishing' ? 'Finishing your draft…' : 'Listening… tap the mic when done'}</span>
                <button type="button" className="voice-status-stop" onClick={cancelMic}>Cancel</button>
              </>
            )}
            {micError && (
              <>
                <span className="flex-grow-1">{micError}</span>
                <button type="button" className="voice-status-x" aria-label="Dismiss voice message" onClick={clearMicError}>
                  <Icon name="x" size={11} />
                </button>
              </>
            )}
            {!micError && speakingId && (
              <>
                <span className="voice-bars" aria-hidden="true"><i /><i /><i /></span>
                <span className="flex-grow-1">Speaking…</span>
                <button type="button" className="voice-status-stop" onClick={stopSpeak}>
                  <Icon name="stop" size={11} /> Stop
                </button>
              </>
            )}
          </div>
        )}

        <form
          className="chat-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat(input);
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            placeholder={micState === 'listening' ? 'Listening…' : 'Ask about markets, times or produce…'}
            aria-label="Message FreshFind Assistant"
            value={input}
            onChange={autoResize}
            readOnly={micState !== 'idle'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (micState === 'idle') sendChat(input);
              }
            }}
          />
          {micSupported && (
            <button
              type="button"
              className={`chat-mic${micState === 'listening' ? ' on' : ''}`}
              aria-label={micState === 'listening' ? 'Stop voice input' : 'Speak your question'}
              aria-pressed={micState === 'listening'}
              onClick={onMic}
              disabled={typing || micState === 'finishing'}
            >
              <Icon name={micState === 'listening' ? 'micOff' : 'mic'} size={15} />
            </button>
          )}
          <button
            type="submit"
            className="chat-send"
            aria-label="Send message"
            disabled={!input.trim() || typing || micState !== 'idle'}
          >
            <Icon name="send" size={14} />
          </button>
        </form>
      </div>

      <div className="chat-toggle-wrap">
        <button className={`chat-hint${hintVisible ? ' show' : ''}`} type="button" onClick={() => openChat(true)}>
          <span style={{ fontWeight: 500, color: '#15803d' }}>Need a hand?</span>
          <br />
          Ask me which markets are open now
        </button>
        <button
          className="chat-fab"
          aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
          onClick={() => openChat(!open)}
        >
          <Icon name={open ? 'x' : 'chat'} size={20} />
        </button>
      </div>
    </>
  );
}
