import Icon from './Icon.jsx';

/* Full-screen boot screen shown while the app settles — kept in the
   botanical-journal art direction: ivory paper wash, the pistachio leaf
   mark floating, a hand-drawn underline that strokes itself in, and three
   bouncing seeds. It fades out on its own once React hands control to App. */
export default function AppLoader({ leaving = false }) {
  return (
    <div
      className={`app-loader${leaving ? ' app-loader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="FreshFind is loading"
    >
      <div className="app-loader-inner">
        <span className="app-loader-mark" aria-hidden="true">
          <Icon name="leaf" size={30} />
        </span>
        <span className="app-loader-title">FreshFind</span>
        <span className="app-loader-sub">fresh all along</span>
        <svg className="app-loader-rule" width="150" height="10" viewBox="0 0 150 10" aria-hidden="true">
          <path d="M4 6.5 C30 1.5 52 8.5 76 4.5 C100 1 126 8 146 4" fill="none" stroke="#C98A99" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="app-loader-seeds" aria-hidden="true"><span /><span /><span /></span>
        <span className="app-loader-hint">picking the freshest bits…</span>
      </div>
    </div>
  );
}
