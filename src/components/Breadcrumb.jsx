import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export default function Breadcrumb({ items }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <Link to="/">
        <Icon name="home" size={14} /> Home
      </Link>
      {items.map((it, i) => (
        <span key={i} className="d-inline-flex align-items-center gap-1">
          <Icon name="chevron" size={14} />
          {it.to && i < items.length - 1 ? (
            <Link to={it.to}>{it.label}</Link>
          ) : (
            <span className="here">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
