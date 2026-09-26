import { useId, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat.jsx';
import { useSupportModal } from '../hooks/useSupportModal.jsx';
import Icon from './Icon.jsx';
import SupportModal from './SupportModal.jsx';

/* Content preserved from the former standalone FAQ page. */
const FAQS = [
  {
    q: 'What is FreshFind?',
    a: 'FreshFind is a frontend web application that helps you discover local farmers\u2019 markets, check their opening schedules and locations, explore seasonal produce, and plan your visits. It runs entirely in your browser.',
  },
  {
    q: 'How is a market\u2019s "Open Now" status calculated?',
    a: 'Each market has a weekly schedule (the days it runs plus opening and closing times). FreshFind compares that schedule with your device\u2019s current day and time to show Open Now, Opens Today, or the next opening day.',
  },
  {
    q: 'Is the market data real?',
    a: 'FreshFind is a demonstration project. The listed markets, addresses and coordinates are sample data used to showcase the application, so they should not be treated as verified real-world locations.',
  },
  {
    q: 'Do I need an account to use FreshFind?',
    a: 'No. There are no accounts and nothing is sent to a server. Features like saved items work entirely in your browser.',
  },
  {
    q: 'How do saved items work?',
    a: 'When you save a market or produce item, it is stored in your browser\u2019s local storage under this site. Saved items and any notes you add stay on your device; you can export them from Saved Items.',
  },
  {
    q: 'How does the "Near Me" / location feature work?',
    a: 'It uses your browser\u2019s built-in geolocation, only when you choose to use it, and only after you grant permission. Your coordinates are used in the browser to sort markets by distance and are never uploaded anywhere.',
  },
  {
    q: 'Where do the map images come from?',
    a: 'The interactive maps use OpenStreetMap tiles, which are loaded from OpenStreetMap\u2019s public tile servers. Directions links open Google Maps in a new tab only when you click them.',
  },
  {
    q: 'Can I talk to someone for help?',
    a: 'You can use the FreshFind Assistant chat widget for quick answers about markets and produce, or visit the Contact section at the bottom of the homepage to see the available contact details.',
  },
];

export default function FaqModal({ open, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);
  const baseId = useId().replace(/:/g, '');
  const groupRef = useRef(null);
  const { openChat } = useChat();
  const { openSupport } = useSupportModal();

  const toggle = (i) => setOpenIndex((cur) => (cur === i ? null : i));

  /* Arrow keys move between question buttons (roving focus without
     roving tabindex, so Tab behaviour stays predictable). */
  const onAccordionKey = (e, i) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    let next = null;
    if (move != null) next = (i + move + FAQS.length) % FAQS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = FAQS.length - 1;
    if (next == null) return;
    e.preventDefault();
    groupRef.current
      ?.querySelectorAll('.faq-q')
      ?.[next]?.focus();
  };

  const askAssistant = () => {
    onClose();
    openChat(true);
  };

  const openHelp = () => openSupport('help');

  return (
    <SupportModal
      open={open}
      onClose={onClose}
      icon="info"
      title="Frequently Asked Questions"
      intro="Answers to common questions about using FreshFind."
    >
      <div ref={groupRef} className="faq-acc" role="group" aria-label="Frequently asked questions">
        {FAQS.map((f, i) => {
          const isOpen = openIndex === i;
          const qId = `faq-q-${baseId}-${i}`;
          const aId = `faq-a-${baseId}-${i}`;
          return (
            <div key={f.q} className={`faq-item${isOpen ? ' open' : ''}`}>
              <h3 className="faq-item-head">
                <button
                  id={qId}
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={aId}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => onAccordionKey(e, i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-chev" aria-hidden="true"><Icon name="chevron" size={16} /></span>
                </button>
              </h3>
              <div id={aId} role="region" aria-labelledby={qId} hidden={!isOpen}>
                <p className="faq-a">{f.a}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ff-card p-3 mt-3 text-center">
        <h3 className="h6 mb-2">Still have a question?</h3>
        <p className="small text-muted mb-3">
          Ask the FreshFind Assistant or check the Help Center for a guided tour of the site.
        </p>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button className="btn-green" onClick={askAssistant}>
            <Icon name="chat" size={16} /> Ask the Assistant
          </button>
          <button className="btn-outline-green" onClick={openHelp}>
            <Icon name="info" size={16} /> Open the Help Center
          </button>
        </div>
      </div>
    </SupportModal>
  );
}
