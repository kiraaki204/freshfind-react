import SupportModal from './SupportModal.jsx';

/* Content preserved from the former standalone Terms of Service page — the
   wording is accurate about the browser-only nature of the app, third-party
   map services and local storage. */
export default function TermsModal({ open, onClose }) {
  return (
    <SupportModal
      open={open}
      onClose={onClose}
      icon="checkc"
      title="Terms of Service"
      intro="Last updated: September 2026"
    >
      <div className="ff-card p-3 mb-3">
        <h3 className="h6">1. About this application</h3>
        <p className="small text-muted mb-0">
          FreshFind is a browser-based farmers'-market discovery journal. It runs entirely in your web
          browser: there is no backend,
          no user accounts, and no data is submitted to any server operated by FreshFind.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">2. Sample listings</h3>
        <p className="small text-muted mb-0">
          The markets, produce items, schedules, addresses and map coordinates shown in FreshFind
          are sample listings created for this journal. They are not verified real-world
          businesses or locations and should not be relied upon for travel or purchasing decisions.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">3. Use of the application</h3>
        <p className="small text-muted mb-0">
          You may use FreshFind freely for personal, educational and evaluation purposes. Features
          such as saved items, notes and chat history are stored only in your own browser and you
          are responsible for the device you use to access the site.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">4. Third-party services</h3>
        <p className="small text-muted mb-0">
          Maps are rendered using OpenStreetMap tiles, which are provided by the OpenStreetMap
          Foundation under its own terms and tile usage policy. Links labelled "Directions" or
          similar open Google Maps in a new tab; Google Maps is governed by Google's own terms and
          policies. FreshFind has no control over these external services.
        </p>
      </div>

      <div className="ff-card p-3 mb-3">
        <h3 className="h6">5. No warranty</h3>
        <p className="small text-muted mb-0">
          FreshFind is provided "as is", without warranties of any kind. Information such as
          opening times or produce availability is illustrative and may not reflect reality.
        </p>
      </div>

      <div className="ff-card p-3">
        <h3 className="h6">6. Changes</h3>
        <p className="small text-muted mb-0">
          These terms may be updated as the application evolves. Continued use of FreshFind after
          changes means you accept the updated terms.
        </p>
      </div>
    </SupportModal>
  );
}
