export default function PageLoader({ hidden }) {
  return (
    <div className={`page-loader${hidden ? ' hidden' : ''}`}>
      <div className="loader-inner">
        <div className="lab-icon-container">
          <svg className="tech-svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="shield-path" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <circle cx="12" cy="8" r="1.5" className="node node-1" fill="var(--gold)" stroke="none" />
            <circle cx="8" cy="14" r="1.5" className="node node-2" fill="var(--gold)" stroke="none" />
            <circle cx="16" cy="14" r="1.5" className="node node-3" fill="var(--gold)" stroke="none" />
            <path className="circuit-line" d="M12 9.5L8.5 13M12 9.5L15.5 13M8 15.5h8" strokeWidth="1" />
          </svg>
        </div>
        <div className="loader-logo" style={{ fontSize: '1.2rem', marginTop: '-0.5rem' }}>
          Paviq<span>Labs</span>
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  )
}
