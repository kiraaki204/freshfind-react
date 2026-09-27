import Icon from './Icon.jsx';

const SOCIALS = [
  ['fb', 'Facebook'],
  ['ig', 'Instagram'],
  ['xtw', 'X'],
  ['yt', 'YouTube'],
];

export default function SocialRow({ tone = 'light' }) {
  let cls = 'social-light';
  if (tone === 'dark') cls = 'social-dark';
  else if (tone === 'contact') cls = 'social-contact';
  return SOCIALS.map(([icon, label]) => (
    <button key={icon} type="button" className={`social-btn ${cls}`} aria-label={label}>
      <Icon name={icon} size={16} />
    </button>
  ));
}
