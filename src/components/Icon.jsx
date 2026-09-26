import { cloneElement } from 'react';

/* Inline SVG icon set (24x24, stroke-based unless noted). */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

const ICONS = {
  leaf: <svg viewBox="0 0 24 24" {...S}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>,
  search: <svg viewBox="0 0 24 24" {...S}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  heart: <svg viewBox="0 0 24 24" {...S}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
  menu: <svg viewBox="0 0 24 24" {...S}><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
  x: <svg viewBox="0 0 24 24" {...S}><path d="M18 6 6 18M6 6l12 12" /></svg>,
  home: <svg viewBox="0 0 24 24" {...S}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>,
  pin: <svg viewBox="0 0 24 24" {...S}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  carrot: <svg viewBox="0 0 24 24" {...S}><path d="M2.3 21.7c.4.4 1 .6 1.5.4 2.6-.8 8.2-3.4 12.4-7.6 1.3-1.3 2-3 2-4.8 0-.4 0-.8-.1-1.1" /><path d="M20.6 13.2c.4-.9.6-1.9.4-2.9-.2-1.3-.9-2.5-1.9-3.4-1-.9-2.2-1.5-3.5-1.6" /><path d="M16 2s.4 2.2-1.2 3.8S11 8 11 8" /><path d="M18 8s2.2.4 3.8-1.2S24 2 24 2" /></svg>,
  info: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
  phone: <svg viewBox="0 0 24 24" {...S}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.1z" /></svg>,
  chevron: <svg viewBox="0 0 24 24" {...S}><path d="m9 18 6-6-6-6" /></svg>,
  chevronL: <svg viewBox="0 0 24 24" {...S}><path d="m15 18-6-6 6-6" /></svg>,
  clock: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  users: <svg viewBox="0 0 24 24" {...S}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  check: <svg viewBox="0 0 24 24" {...S}><path d="M20 6 9 17l-5-5" /></svg>,
  store: <svg viewBox="0 0 24 24" {...S}><path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a3 3 0 0 0-6 0v4" /><path d="M2 7h20" /></svg>,
  chat: <svg viewBox="0 0 24 24" {...S}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>,
  send: <svg viewBox="0 0 24 24" {...S}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
  trash: <svg viewBox="0 0 24 24" {...S}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  'arrow-down': <svg viewBox="0 0 24 24" {...S}><path d="M12 5v14M19 12l-7 7-7-7" /></svg>,
  nav: <svg viewBox="0 0 24 24" {...S}><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>,
  list: <svg viewBox="0 0 24 24" {...S}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  map: <svg viewBox="0 0 24 24" {...S}><path d="M14.1 17.5 9 20.4 3.7 17.8a1 1 0 0 1-.5-.9V5.3a1 1 0 0 1 1.4-.9L9 6.6l5.3-2.8 5.3 2.6a1 1 0 0 1 .5.9v11.6a1 1 0 0 1-1.4.9Z" /></svg>,
  sliders: <svg viewBox="0 0 24 24" {...S}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></svg>,
  mail: <svg viewBox="0 0 24 24" {...S}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  globe: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  calendar: <svg viewBox="0 0 24 24" {...S}><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  share: <svg viewBox="0 0 24 24" {...S}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></svg>,
  download: <svg viewBox="0 0 24 24" {...S}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>,
  edit: <svg viewBox="0 0 24 24" {...S}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
  save: <svg viewBox="0 0 24 24" {...S}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>,
  flower: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg>,
  sun: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  snow: <svg viewBox="0 0 24 24" {...S}><path d="M2 12h20M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" /></svg>,
  sprout: <svg viewBox="0 0 24 24" {...S}><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></svg>,
  user: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="8" r="4" /><path d="M6 20v-1a6 6 0 0 1 12 0v1" /></svg>,
  msg: <svg viewBox="0 0 24 24" {...S}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  bulb: <svg viewBox="0 0 24 24" {...S}><path d="M9 18h6M10 22h4" /><path d="M15.1 14.2A6 6 0 1 0 9 14.2L10 18h4z" /></svg>,
  parking: <svg viewBox="0 0 24 24" {...S}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>,
  paw: <svg viewBox="0 0 24 24" {...S}><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="16" r="2" /><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.05Q6.52 17.48 4.4 16.2a3.5 3.5 0 1 1 3.2-6.1Z" /></svg>,
  access: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="8" r="1.5" /><path d="M8 14h8M10 11l-1 6M14 11l1 6" /></svg>,
  checkc: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>,
  alert: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>,
  tag: <svg viewBox="0 0 24 24" {...S}><path d="M12.6 2.3a2 2 0 0 0-1.8-.5L4.4 3.5a2 2 0 0 0-1.5 1.6l-1.7 6.4a2 2 0 0 0 .5 1.8l8.4 8.4a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>,
  fb: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h2.5V6H14c-2.2 0-3.8 1.6-3.8 3.8v1.9H8.4V14h1.8v6h2.9v-6h2.2l.4-2.3h-2.6v-1.7c0-.6.4-1 .9-1z" /></svg>,
  ig: <svg viewBox="0 0 24 24" {...S}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" /></svg>,
  xtw: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3.5h3.9l4.2 5.6 4.6-5.6h2.4l-5.9 7.1 6.3 8.9h-3.9l-4.5-6-4.9 6H3.5l6.2-7.5L4 3.5z" /></svg>,
  yt: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2c-.2-1.1-.9-1.9-2-2.1C17.7 4.8 12 4.8 12 4.8s-5.7 0-7.6.3c-1.1.2-1.8 1-2 2.1-.3 1.9-.3 4.8-.3 4.8s0 2.9.3 4.8c.2 1.1.9 1.9 2 2.1 1.9.3 7.6.3 7.6.3s5.7 0 7.6-.3c1.1-.2 1.8-1 2-2.1.3-1.9.3-4.8.3-4.8s0-2.9-.3-4.8zM10.2 15.4V8.6l5.8 3.4-5.8 3.4z" /></svg>,
};

export default function Icon({ name, size = 16, className }) {
  const svg = ICONS[name];
  if (!svg) return null;
  return cloneElement(svg, { width: size, height: size, 'aria-hidden': true, className });
}
