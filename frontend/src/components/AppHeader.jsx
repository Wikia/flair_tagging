// Themed header with SVG art backgrounds (and real photos for known wikis via CSS)

const DECORS = {
  default: ['✨', '💫', '💭', '⭐'],
  dandys:  ['👁️', '🎪', '🃏', '💀'],
  hunger:  ['🔥', '🏹', '🪶', '⚔️'],
  color:   ['✨', '💫', '🌟', '⭐'],
}

// SVG art only used for themes WITHOUT real photos (default + color)
function HeaderArt({ theme, accent }) {
  if (theme === 'color') {
    const c = accent || '#1EA7B8'
    return (
      <svg viewBox="0 0 1100 140" preserveAspectRatio="xMaxYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="color-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c} />
            <stop offset="1" stopColor={c} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="1100" height="140" fill="url(#color-bg)" />
        {[[200,45,12],[340,90,8],[520,30,14],[820,95,10],[960,50,16]].map(([x,y,r],i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d={`M 0 -${r} L ${r*0.3} -${r*0.3} L ${r} 0 L ${r*0.3} ${r*0.3} L 0 ${r} L -${r*0.3} ${r*0.3} L -${r} 0 L -${r*0.3} -${r*0.3} Z`}
              fill="#FFFFFF" opacity="0.45" />
          </g>
        ))}
      </svg>
    )
  }

  // Default Fandom theme
  return (
    <svg viewBox="0 0 1100 140" preserveAspectRatio="xMaxYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="fandom-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FA005A" />
          <stop offset="0.5" stopColor="#C2004C" />
          <stop offset="1" stopColor="#520044" />
        </linearGradient>
      </defs>
      <rect width="1100" height="140" fill="url(#fandom-bg)" />
      <g opacity="0.09" fontFamily="'Space Mono', monospace" fontSize="14" fontWeight="700" fill="#FFFFFF" letterSpacing="3">
        <text x="0" y="30">fandom · fandom · fandom · fandom · fandom · fandom ·</text>
        <text x="40" y="70">fandom · fandom · fandom · fandom · fandom · fandom ·</text>
        <text x="-20" y="110">fandom · fandom · fandom · fandom · fandom · fandom ·</text>
      </g>
      {[[200,45,12],[340,90,8],[520,30,14],[820,95,10],[960,50,16]].map(([x,y,r],i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d={`M 0 -${r} L ${r*0.3} -${r*0.3} L ${r} 0 L ${r*0.3} ${r*0.3} L 0 ${r} L -${r*0.3} ${r*0.3} L -${r} 0 L -${r*0.3} -${r*0.3} Z`}
            fill="#FFC500" opacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

// Wikis with real photo backgrounds handled via CSS
const PHOTO_THEMES = new Set(['dandys', 'hunger'])

export default function AppHeader({ wiki }) {
  const theme = wiki?.theme || 'default'
  const title = wiki ? `${wiki.name} Discussions` : 'Fandom Discussions'
  const decors = DECORS[theme] || DECORS.default

  return (
    <header className="app-header">
      <div className="header-bg">
        {!PHOTO_THEMES.has(theme) && <HeaderArt theme={theme} accent={wiki?.accent} />}
      </div>
      <div className="app-header-inner">
        <div className="logo-tile">
          <img src="/image/fandom-icon.png" alt="Fandom" />
        </div>
        <div className="header-title">
          <div className="title">{title}</div>
          {wiki && <div className="sub">powered by Fandom</div>}
        </div>
        <div className="header-decors">
          {decors.map((d, i) => (
            <span key={i} className="header-decor" style={{ animationDelay: `${i * 0.4}s` }}>{d}</span>
          ))}
        </div>
      </div>
    </header>
  )
}
