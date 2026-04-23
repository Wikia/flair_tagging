import { useState, useRef, useEffect, useMemo } from 'react'
import { FLAIRS } from '../constants'
import { classNames } from '../utils'

function WikiFilter({ wiki, wikis, onPick, onClear }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() =>
    wikis.filter(w => w.name.toLowerCase().includes(q.toLowerCase())),
    [wikis, q]
  )

  return (
    <div className="wiki-search" ref={ref}>
      <span className="wiki-search-icon">🌐</span>
      {wiki ? (
        <input
          className="wiki-input"
          readOnly
          value={wiki.name}
          onClick={() => setOpen(true)}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <input
          className="wiki-input"
          placeholder="All wikis — search to filter"
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
      )}
      {wiki && (
        <button className="wiki-clear" onClick={onClear} aria-label="Clear wiki">×</button>
      )}
      {open && !wiki && filtered.length > 0 && (
        <div className="wiki-dropdown">
          {filtered.map(w => (
            <button key={w.id} className="wiki-option"
              onClick={() => { onPick(w); setOpen(false); setQ('') }}
            >
              <span className="swatch" style={{ background: w.accent }} />
              {w.name}
            </button>
          ))}
          {filtered.length === 0 && <div className="wiki-option-empty">No wikis found</div>}
        </div>
      )}
    </div>
  )
}

export default function ControlsPanel({
  wiki, wikis, onPickWiki, onClearWiki,
  flair, onFlair,
  query, onQuery,
  sort, onSort,
  layout, onLayout,
  flairCounts,
}) {
  return (
    <div className="controls-panel">
      <div className="wiki-row">
        <div style={{ flex: 1 }}>
          <div className="section-eyebrow" style={{ marginBottom: 6 }}>🌐 Wiki</div>
          <WikiFilter wiki={wiki} wikis={wikis} onPick={onPickWiki} onClear={onClearWiki} />
        </div>
      </div>

      <div className="section-eyebrow" style={{ marginBottom: 8 }}>🏷️ Flair</div>
      <div className="cat-tabs">
        <button
          className={classNames('cat-tab', !flair && 'active')}
          onClick={() => onFlair(null)}
        >
          <span className="emoji">🌐</span> All
          <span className="count">{flairCounts.__all || 0}</span>
        </button>
        {FLAIRS.map(f => {
          const n = flairCounts[f.id] || 0
          if (n === 0) return null
          return (
            <button key={f.id}
              className={classNames('cat-tab', flair === f.id && 'active')}
              onClick={() => onFlair(f.id)}
            >
              <span className="emoji">{f.emoji}</span> {f.label}
              <span className="count">{n}</span>
            </button>
          )
        })}
      </div>

      <div className="section-eyebrow" style={{ marginBottom: 8 }}>🔍 Search &amp; Sort</div>
      <div className="ss-row">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search threads…"
            value={query}
            onChange={e => onQuery(e.target.value)}
          />
        </div>
        <div className="sort-pills">
          {[
            { id: 'latest',  label: 'Latest',       emoji: '🕐' },
            { id: 'liked',   label: 'Most Liked',    emoji: '❤️' },
            { id: 'replies', label: 'Most Replies',  emoji: '💬' },
          ].map(s => (
            <button key={s.id}
              className={classNames('sort-pill', sort === s.id && 'active')}
              onClick={() => onSort(s.id)}
            >
              <span>{s.emoji}</span> {s.label}
            </button>
          ))}
        </div>
        <div className="layout-toggle">
          {[
            { id: 'cozy',     label: 'Cozy' },
            { id: 'compact',  label: 'Compact' },
            { id: 'magazine', label: 'Mag' },
          ].map(l => (
            <button key={l.id}
              className={classNames(layout === l.id && 'active')}
              onClick={() => onLayout(l.id)}
            >{l.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
