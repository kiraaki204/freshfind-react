import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import SupportModal from './SupportModal.jsx';

/* Content preserved from the former standalone Help Center page. */
const GUIDES = [
  {
    icon: 'search',
    title: 'Find a market',
    body: 'Use the Find a Market page to search by name, area or produce, filter by day of the week, and sort alphabetically, by rating or by next opening. Switch to the map view to see every matching market on an interactive street map.',
  },
  {
    icon: 'nav',
    title: 'Use your location',
    body: 'Press the Near Me button on the Market Directory to share your location (your browser will ask for permission first). Markets are then sorted by distance, the map centres on your area, and a blue dot shows where you are.',
  },
  {
    icon: 'carrot',
    title: 'Explore the Produce Guide',
    body: 'Browse produce by category or season, search for specific items, and open any item for storage tips, nutrition highlights and the markets where it is typically available.',
  },
  {
    icon: 'heart',
    title: 'Save markets and produce',
    body: 'Use the heart button on any market or produce card to save it. Your saved items live in your browser — add personal notes to them and export the list from Saved Items.',
  },
  {
    icon: 'chat',
    title: 'Chat with the assistant',
    body: 'The FreshFind Assistant (bottom-right corner) can answer questions about markets, opening times and produce, filter the directory for you, and even show a specific market on the map.',
  },
  {
    icon: 'pin',
    title: 'Get directions',
    body: 'Every market page includes an interactive map and a Get Directions button that opens the market\u2019s address in Google Maps so you can plan your route with your preferred maps app.',
  },
];

export default function HelpCenterModal({ open, onClose }) {
  const navigate = useNavigate();

  // an action that navigates elsewhere always closes the modal first
  const closeAndGo = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <SupportModal
      open={open}
      onClose={onClose}
      wide
      icon="info"
      title="Help Center"
      intro="How to get the most out of FreshFind — from finding markets to saving favourites."
    >
      <div className="row g-3">
        {GUIDES.map((g) => (
          <div key={g.title} className="col-md-6">
            <div className="ff-card p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="rounded-3 d-inline-flex align-items-center justify-content-center"
                  style={{ width: 36, height: 36, background: 'var(--pistachio)', color: 'var(--forest)' }}
                >
                  <Icon name={g.icon} size={18} />
                </span>
                <h3 className="h6 mb-0">{g.title}</h3>
              </div>
              <p className="small text-muted mb-0">{g.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ff-card p-3 mt-3 text-center">
        <h3 className="h6 mb-2">Ready to explore?</h3>
        <p className="small text-muted mb-3">Jump straight into the market directory or the produce guide.</p>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button className="btn-green" onClick={() => closeAndGo('/markets')}>
            <Icon name="store" size={16} /> Find a Market
          </button>
          <button className="btn-outline-green" onClick={() => closeAndGo('/#produce')}>
            <Icon name="carrot" size={16} /> Produce Guide
          </button>
        </div>
      </div>
    </SupportModal>
  );
}
