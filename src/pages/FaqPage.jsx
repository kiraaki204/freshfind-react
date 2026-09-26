import Breadcrumb from '../components/Breadcrumb.jsx';
import Icon from '../components/Icon.jsx';

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
    a: 'When you save a market or produce item, it is stored in your browser\u2019s local storage under this site. Saved items and any notes you add stay on your device; you can export them from the Saved Items page.',
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
    a: 'You can use the FreshFind Assistant chat widget for quick answers about markets and produce, or visit the Contact Us page to see the available contact details.',
  },
];

export default function FaqPage() {
  return (
    <div className="wrap" style={{ maxWidth: '56rem' }}>
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      <h1 className="h3 mt-3"><Icon name="info" size={22} /> Frequently Asked Questions</h1>
      <p className="text-muted">Answers to common questions about using FreshFind.</p>

      {FAQS.map((f) => (
        <details key={f.q} className="ff-card p-3 mb-2">
          <summary className="fw-semibold" style={{ cursor: 'pointer' }}>{f.q}</summary>
          <p className="small text-muted mt-2 mb-0">{f.a}</p>
        </details>
      ))}

      <div className="ff-card p-4 mt-4 text-center">
        <h2 className="h6 mb-2">Still have a question?</h2>
        <p className="small text-muted mb-3">Ask the FreshFind Assistant or check the Help Center for a guided tour of the site.</p>
        <a className="btn-green" href="/help">Visit the Help Center</a>
      </div>
    </div>
  );
}
