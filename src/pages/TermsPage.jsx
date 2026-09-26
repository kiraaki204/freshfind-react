import Breadcrumb from '../components/Breadcrumb.jsx';
import Icon from '../components/Icon.jsx';

export default function TermsPage() {
  return (
    <div className="wrap" style={{ maxWidth: '56rem' }}>
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />
      <h1 className="h3 mt-3"><Icon name="checkc" size={22} /> Terms of Service</h1>
      <p className="small text-muted">Last updated: September 2026</p>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">1. About this application</h2>
        <p className="small text-muted mb-0">
          FreshFind is a frontend demonstration application that showcases how a farmers'-market
          discovery service could work. It runs entirely in your web browser: there is no backend,
          no user accounts, and no data is submitted to any server operated by FreshFind.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">2. Demonstration data</h2>
        <p className="small text-muted mb-0">
          The markets, produce items, schedules, addresses and map coordinates shown in FreshFind
          are sample data created for demonstration purposes. They are not verified real-world
          businesses or locations and should not be relied upon for travel or purchasing decisions.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">3. Use of the application</h2>
        <p className="small text-muted mb-0">
          You may use FreshFind freely for personal, educational and evaluation purposes. Features
          such as saved items, notes and chat history are stored only in your own browser and you
          are responsible for the device you use to access the site.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">4. Third-party services</h2>
        <p className="small text-muted mb-0">
          Maps are rendered using OpenStreetMap tiles, which are provided by the OpenStreetMap
          Foundation under its own terms and tile usage policy. Links labelled "Directions" or
          similar open Google Maps in a new tab; Google Maps is governed by Google's own terms and
          policies. FreshFind has no control over these external services.
        </p>
      </div>

      <div className="ff-card p-4 mb-3">
        <h2 className="h6">5. No warranty</h2>
        <p className="small text-muted mb-0">
          FreshFind is provided "as is", without warranties of any kind. Information such as
          opening times or produce availability is illustrative and may not reflect reality.
        </p>
      </div>

      <div className="ff-card p-4">
        <h2 className="h6">6. Changes</h2>
        <p className="small text-muted mb-0">
          These terms may be updated as the application evolves. Continued use of FreshFind after
          changes means you accept the updated terms.
        </p>
      </div>
    </div>
  );
}
