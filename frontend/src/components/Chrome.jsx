import { classNames } from '../utils'

const RAIL_ITEMS = [
  { id: 'home',     icon: '🏠', label: 'Home' },
  { id: 'explore',  icon: '🧭', label: 'Explore' },
  { id: 'saved',    icon: '🔖', label: 'Saved' },
  { id: 'progress', icon: '⭐', label: 'Progress' },
  { id: 'history',  icon: '🕐', label: 'History' },
  { id: 'flair',    icon: '🏷️', label: 'Flair Tagger', featured: true },
]

export default function FandomChrome({ children, onOpenTweaks }) {
  return (
    <div className="fandom-chrome">
      <div className="fandom-topbar">
        <div className="fandom-topbar-inner">
          <div className="fandom-wordmark">
            <img src="/image/fandom-icon.png" alt="Fandom" style={{ height: 26, width: 'auto' }} />
          </div>
          <div className="fandom-topbar-search">
            <span>🔍</span>
            <input placeholder="Search Fandom" />
          </div>
          <div className="fandom-topbar-actions">
            <button className="fandom-topbar-icon" title="Notifications">🔔</button>
            <div className="fandom-topbar-avatar">A</div>
          </div>
        </div>
      </div>

      <aside className="fandom-rail">
        {RAIL_ITEMS.map(r => (
          <div
            key={r.id}
            className={classNames('rail-item', r.id === 'flair' && 'active', r.featured && 'featured')}
          >
            <div className="rail-icon">{r.icon}</div>
            <div className="rail-label">{r.label}</div>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button className="rail-item" onClick={onOpenTweaks} title="More">
          <div className="rail-icon">⋯</div>
          <div className="rail-label">More</div>
        </button>
      </aside>

      <div className="fandom-main">{children}</div>
    </div>
  )
}
