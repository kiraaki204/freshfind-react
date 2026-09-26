import Icon from '../components/Icon.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';

const STATS = [
  { v: '8+', l: 'Farmers Markets', i: 'pin' },
  { v: '200+', l: 'Local Vendors', i: 'users' },
  { v: '12k+', l: 'Monthly Visitors', i: 'star' },
  { v: '5+', l: 'Years of Community', i: 'heart' },
];

const MISSIONS = [
  { t: 'Connect Communities', d: 'Make it easy for everyone to find and visit their nearest farmers\' market.' },
  { t: 'Support Local Farmers', d: 'Help small, local farms reach more customers and build sustainable businesses.' },
  { t: 'Promote Seasonal Eating', d: 'Educate shoppers about seasonal produce and the benefits of eating locally.' },
  { t: 'Build Food Knowledge', d: 'Help people understand where their food comes from and how to use it.' },
];

const HOW = [
  { n: '1', t: 'We Research Markets', d: 'Our team researches and verifies information for every farmers\' market in the directory.' },
  { n: '2', t: 'You Discover Markets', d: 'Search, filter, and explore markets by location, day, and produce type.' },
  { n: '3', t: 'Visit & Support Local', d: 'Use FreshFind to plan your visit and support your local farming community.' },
];

const VALUES = [
  { t: 'Fresh & Local', d: 'We believe everyone deserves access to fresh, locally grown food from farmers they can trust.', bg: '#dcfce7', c: '#16a34a', i: 'leaf' },
  { t: 'Community First', d: 'Farmers\' markets are more than food — they\'re gathering places that strengthen communities.', bg: '#dbeafe', c: '#2563eb', i: 'users' },
  { t: 'Support Farmers', d: 'Every purchase at a farmers\' market supports a local family and their farming operation.', bg: '#fee2e2', c: '#dc2626', i: 'heart' },
  { t: 'Quality Information', d: 'We work hard to keep market information accurate, up-to-date and genuinely useful.', bg: '#fef3c7', c: '#d97706', i: 'star' },
];

const TEAM = [
  { n: 'Sarah Green', r: 'Founder & CEO', b: 'Former organic farmer passionate about connecting communities with local food.', i: 'sprout' },
  { n: 'Marcus Chen', r: 'Head of Technology', b: 'Full-stack developer with a love for sustainable tech and local food systems.', i: 'globe' },
  { n: 'Priya Patel', r: 'Community Manager', b: 'Community organiser with 8 years of experience supporting local food networks.', i: 'users' },
  { n: 'Tom Riverside', r: 'Market Relations', b: 'Former market manager who knows every vendor by name in the city.', i: 'store' },
];

export default function AboutPage() {
  return (
    <div className="wrap">
      <Breadcrumb items={[{ label: 'About Us' }]} />

      <div className="rounded-4 p-5 text-white text-center mb-4 mt-3" style={{ background: 'linear-gradient(135deg,#15803d,#14532d)' }}>
        <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4" style={{ width: 64, height: 64, background: 'rgba(255,255,255,.2)' }}>
          <Icon name="leaf" size={32} />
        </div>
        <h1 className="h2">About FreshFind</h1>
        <p className="mb-0" style={{ color: '#bbf7d0', maxWidth: '36rem', margin: '0 auto' }}>
          FreshFind was born from a simple belief: finding fresh, local food should be easy, enjoyable, and available to everyone.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {STATS.map((s) => (
          <div key={s.l} className="col-6 col-lg-3">
            <div className="ff-card p-4 text-center">
              <div style={{ color: '#16a34a' }}><Icon name={s.i} size={22} /></div>
              <div className="h4 mb-0">{s.v}</div>
              <div className="small text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="ff-card p-4 h-100">
            <h2 className="h4">Our Story</h2>
            <p className="text-muted">
              FreshFind started in 2020 when our founder, a former organic farmer, realised that despite there being
              wonderful farmers' markets all around the city, many residents had no easy way to discover them.
            </p>
            <p className="text-muted">
              After countless conversations with market vendors and shoppers, we built FreshFind — a simple, friendly
              platform that helps people discover markets near them, explore seasonal produce, and plan their visits with ease.
            </p>
            <p className="text-muted mb-0">
              Today, FreshFind lists 8 local farmers' markets and continues to grow. Our mission remains the same:
              connect communities with the freshest local food possible.
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="ff-card p-4 h-100">
            <h2 className="h4">Our Mission</h2>
            {MISSIONS.map((m) => (
              <div key={m.t} className="d-flex gap-2 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 24, height: 24, background: '#dcfce7', color: '#16a34a' }}
                >
                  <Icon name="check" size={12} />
                </div>
                <div>
                  <div className="fw-semibold small">{m.t}</div>
                  <div className="small text-muted">{m.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-4 mb-4" style={{ background: '#f0fdf4', border: '1px solid #dcfce7' }}>
        <h2 className="h4 text-center mb-4">How FreshFind Works</h2>
        <div className="row g-3">
          {HOW.map((s) => (
            <div key={s.n} className="col-sm-4 text-center">
              <div
                className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 48, height: 48, background: '#16a34a' }}
              >
                {s.n}
              </div>
              <h3 className="h6">{s.t}</h3>
              <p className="small text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="h4 text-center mb-4">What We Stand For</h2>
      <div className="row g-3 mb-4">
        {VALUES.map((v) => (
          <div key={v.t} className="col-sm-6 col-lg-3">
            <div className="ff-card p-4 text-center h-100">
              <div
                className="rounded-3 mx-auto mb-2 d-flex align-items-center justify-content-center"
                style={{ width: 48, height: 48, background: v.bg, color: v.c }}
              >
                <Icon name={v.i} size={22} />
              </div>
              <h3 className="h6">{v.t}</h3>
              <p className="small text-muted">{v.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="h4 text-center mb-4">Meet the Team</h2>
      <div className="row g-3">
        {TEAM.map((t) => (
          <div key={t.n} className="col-sm-6 col-lg-3">
            <div className="ff-card p-4 text-center h-100">
              <div
                className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                style={{ width: 56, height: 56, background: '#dcfce7', color: '#15803d' }}
              >
                <Icon name={t.i} size={24} />
              </div>
              <h3 className="h6 mb-0">{t.n}</h3>
              <p className="small mb-2" style={{ color: '#16a34a' }}>{t.r}</p>
              <p className="small text-muted mb-0">{t.b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
