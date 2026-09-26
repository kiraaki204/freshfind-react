import Breadcrumb from '../components/Breadcrumb.jsx';
import Icon from '../components/Icon.jsx';

const STORAGE_KEYS = [
  ['freshfind_bookmarks', 'Your saved markets and produce items, plus any personal notes you add to them.'],
  ['freshfind_chat', 'The most recent 60 messages of your conversation with the FreshFind Assistant.'],
  ['freshfind_chat_hint', 'A small flag remembering that the chatbot welcome hint was shown.'],
  ['freshfind_cart', 'The demo shopping cart you build inside chatbot conversations.'],
];

export default function PrivacyPage() {
  return (
    <div className="wrap" style={{ maxWidth: '56rem' }}>
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <h1 className="h3 mt-3"><Icon name="checkc" size={22} /> Privacy Policy</h1>
      <p className="small text-muted">Last updated: September 2026</p>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">The short version</h2>
        <p className="small text-muted mb-0">
          FreshFind is a frontend-only application. It has no backend and no user accounts, it does
          not collect personal information, and nothing you do on the site is sent to a FreshFind
          server. A few features store data in your own browser, and two third-party services are
          involved when maps or directions are used — both are described below.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">What is stored in your browser</h2>
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

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">Location data</h2>
        <p className="small text-muted mb-0">
          Location is used only when you actively press a location button (such as "Near Me" or
          "Use my location") and only after your browser asks for, and you grant, permission. Your
          coordinates are held in memory to sort markets by distance and show them on the map; they
          are not written to storage and are not transmitted anywhere by FreshFind. Declining the
          permission simply leaves location features switched off.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">Third-party services</h2>
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

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">What FreshFind does NOT do</h2>
        <ul className="small text-muted mb-0">
          <li>No analytics or advertising trackers are embedded.</li>
          <li>No cookies are set by the application.</li>
          <li>The contact form and chatbot are demonstrations — messages are not delivered anywhere.</li>
          <li>The visitor counter shown on the site is generated locally for display purposes only.</li>
        </ul>
      </div>

      <div className="ff-card p-4">
        <h2 className="h6">Questions</h2>
        <p className="small text-muted mb-0">
          If you have questions about this policy, use the details on the{' '}
          <a href="/contact">Contact Us</a> page.
        </p>
      </div>
    </div>
  );
}
