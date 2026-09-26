import { useNavigate, useParams } from 'react-router-dom';
import markets from '../data/markets.json';
import produceData from '../data/produce.json';
import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import SaveButton from '../components/SaveButton.jsx';

export default function ProduceDetailPage() {
  const { produceId } = useParams();
  const navigate = useNavigate();

  const p = produceData.find((x) => x.id === produceId);
  if (!p) {
    return (
      <div className="wrap text-center py-5">
        <h2 className="h5">Produce not found</h2>
        <button className="btn-green" onClick={() => navigate('/produce')}>Back to Produce Guide</button>
      </div>
    );
  }

  const mkts = markets.filter((m) => p.markets.includes(m.id));

  return (
    <div className="wrap" style={{ maxWidth: '64rem' }}>
      <Breadcrumb items={[{ label: 'Produce Guide', to: '/produce' }, { label: p.name }]} />
      <button className="btn btn-link text-muted text-decoration-none ps-0 mb-3" onClick={() => navigate('/produce')}>
        <Icon name="chevronL" size={16} /> Back to Produce Guide
      </button>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="p-thumb rounded-4 mb-3" style={{ height: 220, position: 'relative' }}>
            <span style={{ fontSize: '5rem' }}>{p.emoji}</span>
            <div className="heart-abs">
              <SaveButton item={{ id: `produce-${p.id}`, type: 'produce', name: p.name, category: p.category }} />
            </div>
          </div>
          <div className="ff-card p-3 mb-3">
            <h3 className="h6">In Season</h3>
            <div className="d-flex flex-wrap gap-2">
              {p.season.map((s) => (
                <span key={s} className={`chip season-${s.toLowerCase()}`}>{s}</span>
              ))}
            </div>
          </div>
          <div className="ff-card p-3">
            <h3 className="h6">Details</h3>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Category</span>
              <span>{p.category}</span>
            </div>
            <div className="d-flex justify-content-between small mt-2">
              <span className="text-muted">Available Markets</span>
              <span>{mkts.length}</span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <span className="chip">{p.category}</span>
          <h1 className="h3 mt-2">{p.name}</h1>

          <div className="ff-card p-4 mb-3">
            <h2 className="h6">About</h2>
            <p className="text-muted small mb-0">{p.description}</p>
          </div>

          <div className="ff-card p-4 mb-3">
            <h2 className="h6"><Icon name="leaf" size={16} /> Nutrition Highlights</h2>
            <p className="small text-muted mb-0">{p.nutritionHighlights}</p>
          </div>

          <div className="p-4 rounded-4 mb-3" style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}>
            <h2 className="h6"><Icon name="bulb" size={16} /> Storage Tip</h2>
            <p className="small text-muted mb-0">{p.storageHint}</p>
          </div>

          {mkts.length > 0 && (
            <div className="ff-card p-4">
              <h2 className="h6"><Icon name="pin" size={16} /> Available At</h2>
              {mkts.map((m) => (
                <div
                  key={m.id}
                  className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2"
                  style={{ background: '#f9fafb' }}
                >
                  <div>
                    <div className="small fw-medium">{m.name}</div>
                    <div className="small text-muted">{m.area} · {m.days.join(', ')}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <StatusBadge market={m} />
                    <button className="btn-green py-1 px-2" style={{ fontSize: 12 }} onClick={() => navigate(`/markets/${m.id}`)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
