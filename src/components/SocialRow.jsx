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
    <a key={icon} href="#" className={`social-btn ${cls}`} aria-label={label} onClick={(e) => e.preventDefault()}>
      <Icon name={icon} size={16} />
    </a>
  ));
}
