import { useNavigate } from 'react-router-dom';
import SupportModal from './SupportModal.jsx';

/* Content preserved from the former standalone Privacy Policy page. The
   storage keys and behaviour below were verified against the actual code:
   - freshfind_bookmarks  → src/hooks/useBookmarks.jsx (saves + notes)
   - freshfind_chat       → src/components/ChatWidget.jsx (last 60 messages)
   - freshfind_chat_hint  → src/components/ChatWidget.jsx (welcome-hint flag)
   - freshfind_cart       → src/chatbot/engine.js (chat-only demo cart)
   Location state lives only in memory (src/hooks/useGeolocation.jsx);
   OpenStreetMap tiles and Google Maps directions are the only third-party
   requests involved. */
const STORAGE_KEYS = [
  ['freshfind_bookmarks', 'Your saved markets and produce items, plus any personal notes you add to them.'],
  ['freshfind_chat', 'The most recent 60 messages of your conversation with the FreshFind Assistant.'],
  ['freshfind_chat_hint', 'A small flag remembering that the chatbot welcome hint was shown.'],
  ['freshfind_cart', 'The demo shopping cart you build inside chatbot conversations.'],
];

export default function PrivacyModal({ open, onClose }) {
  const navigate = useNavigate();

  // internal navigation closes the modal first, then scrolls to the section
  const goContact = () => {
    onClose();
    navigate('/#contact');
  };

  return (
    <SupportModal
      open={open}
      onClose={onClose}
      icon="checkc"
      title="Privacy Policy"
      intro="Last updated: September 2026"
    >
      <div className="ff-card p-3 mb-3">
        <h3 className="h6">The short version</h3>
        <p className="small text-muted mb-0">
          FreshFind is a frontend-only application. It has no backend and no user accounts, it does
          not collect personal information, and nothing you do on the site is sent to a FreshFind
          server. A few features store data in your own browser, and two third-party services are
          involved when maps or directions are used — both are described below.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">What is stored in your browser</h3>
        <p className="small text-muted">
          The following information is kept in your browser's local storage so that it survives a
          page reload. It never leaves your device and you can remove it at any time by clearing
          the site's storage in your browser settings.
        </p>
        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
          {STORAGE_KEYS.map(([key, desc]) => (
            <li key={key} className="small text-muted">
              <code style={{ fontSize: 12 }}>{key}</code> — {desc}
            </li>
          ))}
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Location data</h3>
        <p className="small text-muted mb-0">
          Location is used only when you actively press a location button (such as "Near Me" or
          "Use my location") and only after your browser asks for, and you grant, permission. Your
          coordinates are held in memory to sort markets by distance and show them on the map; they
          are not written to storage and are not transmitted anywhere by FreshFind. Declining the
          permission simply leaves location features switched off.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">Third-party services</h3>
        <ul className="small text-muted mb-0">
          <li className="mb-2">
            <strong>OpenStreetMap</strong> — the interactive maps load map-tile images from
            OpenStreetMap's public tile servers. When tiles load, your device's IP address and
            browser details are visible to those servers, and their{' '}
            <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">privacy policy</a> applies.
          </li>
          <li>
            <strong>Google Maps</strong> — only when you click a "Get Directions" or similar link,
            the address opens on google.com in a new tab, where Google's own privacy policy applies.
          </li>
        </ul>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">What FreshFind does NOT do</h3>
        <ul className="small text-muted mb-0">
          <li>No analytics or advertising trackers are embedded.</li>
          <li>No cookies are set by the application.</li>
          <li>The contact form and chatbot are demonstrations — messages are not delivered anywhere.</li>
          <li>The visitor counter shown on the site is generated locally for display purposes only.</li>
        </ul>
      </div>

      <div className="ff-card p-3">
        <h3 className="h6">Questions</h3>
        <p className="small text-muted mb-0">
          If you have questions about this policy, use the details in the{' '}
          <button className="support-text-link" onClick={goContact}>
            Contact section on the homepage
          </button>.
        </p>
      </div>
    </SupportModal>
  );
}
