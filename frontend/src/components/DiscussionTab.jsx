import React, { useState, useEffect, useMemo, useRef } from 'react'
import ThreadCard from './ThreadCard'
import ThreadDetail from './ThreadDetail'

const CATEGORY_LABEL = { other: 'General', Fanfic: 'FanFic' }
export const displayCategory = cat => CATEGORY_LABEL[cat] ?? cat

const CATEGORY_EMOJI = {
  All: '🌐',
  other: '💬',
  General: '💬',
  Fanfic: '📖',
  Trading: '💰',
  Event: '🎉',
  Ranking: '🏆',
  Poll: '📊',
  'New Launch': '🆕',
  Opinion: '💡',
  Theories: '🔮',
  Questions: '❓',
  News: '📰',
}

export function getCategoryEmoji(rawCat) {
  return CATEGORY_EMOJI[rawCat] ?? '💬'
}

function buildThreads(rawPosts) {
  const map = {}
  for (const p of rawPosts) {
    const tid = String(p.thread_id)
    if (!map[tid]) map[tid] = []
    map[tid].push(p)
  }
  return Object.values(map).map(posts => {
    const sorted = [...posts].sort((a, b) => a.position - b.position)
    const op = sorted.find(p => p.post_role === 'op') ?? sorted[0]
    const latestTime = sorted.reduce((m, p) => (p.post_time > m ? p.post_time : m), '')
    const totalLikes = sorted.reduce((s, p) => s + (p.n_likes || 0), 0)
    return {
      thread_id: String(op.thread_id),
      wiki_id: op.wiki_id,
      wiki_name: op.wiki_name,
      title: op.title,
      content: op.content,
      category: op.category || 'other',
      post_time: op.post_time,
      latest_time: latestTime,
      user_name: op.user_name,
      reply_count: sorted.length - 1,
      total_likes: totalLikes,
      posts: sorted,
    }
  })
}

export default function DiscussionTab({ onWikiChange, onThreadSelect, newThreads = [] }) {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWiki, setSelectedWiki] = useState(null)
  const [wikiSearch, setWikiSearch] = useState('')
  const [wikiDropdownOpen, setWikiDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [selectedThread, setSelectedThread] = useState(null)
  const wikiRef = useRef(null)

  useEffect(() => {
    fetch('/data/sample_export.json')
      .then(r => r.json())
      .then(data => {
        setThreads(buildThreads(data))
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    onWikiChange?.(selectedWiki?.name ?? null)
  }, [selectedWiki])

  useEffect(() => {
    onThreadSelect?.(selectedThread !== null)
  }, [selectedThread])

  useEffect(() => {
    function handler(e) {
      if (wikiRef.current && !wikiRef.current.contains(e.target)) {
        setWikiDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const wikis = useMemo(() => {
    const seen = {}
    threads.forEach(t => { seen[t.wiki_id] = t.wiki_name })
    return Object.entries(seen).map(([id, name]) => ({ id: Number(id), name }))
  }, [threads])

  const filteredWikis = useMemo(() =>
    wikis.filter(w => w.name.toLowerCase().includes(wikiSearch.toLowerCase())),
    [wikis, wikiSearch]
  )

  const allThreads = useMemo(() => [...newThreads, ...threads], [newThreads, threads])

  const categories = useMemo(() => {
    const cats = new Set(allThreads.map(t => t.category))
    return ['All', ...cats]
  }, [allThreads])

  const visibleThreads = useMemo(() => {
    let list = allThreads
    if (selectedWiki) list = list.filter(t => t.wiki_id === selectedWiki.id)
    if (selectedCategory !== 'All') list = list.filter(t => t.category === selectedCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.content || '').toLowerCase().includes(q)
      )
    }
    if (sortBy === 'latest') list = [...list].sort((a, b) => b.latest_time.localeCompare(a.latest_time))
    if (sortBy === 'liked') list = [...list].sort((a, b) => b.total_likes - a.total_likes)
    if (sortBy === 'replies') list = [...list].sort((a, b) => b.reply_count - a.reply_count)
    return list
  }, [allThreads, selectedWiki, selectedCategory, searchQuery, sortBy])

  if (loading) return <div className="discussion-loading">Loading threads…</div>

  if (selectedThread) {
    return (
      <ThreadDetail
        thread={selectedThread}
        onBack={() => setSelectedThread(null)}
      />
    )
  }

  return (
    <div className="discussion">
      <div className="discussion-controls">
        {/* Wiki filter */}
        <div className="filter-row">
          <span className="filter-label">🌐 Wiki</span>
          <div className="wiki-filter" ref={wikiRef}>
            <div className="wiki-filter-input-wrap">
              <span className="wiki-filter-icon">🌐</span>
              <input
                className="wiki-filter-input"
                placeholder="All wikis — search to filter"
                value={selectedWiki ? selectedWiki.name : wikiSearch}
                onFocus={() => {
                  if (selectedWiki) { setSelectedWiki(null); setWikiSearch('') }
                  setWikiDropdownOpen(true)
                }}
                onChange={e => { setWikiSearch(e.target.value); setWikiDropdownOpen(true) }}
              />
              {selectedWiki && (
                <button
                  className="wiki-clear-btn"
                  onClick={() => { setSelectedWiki(null); setWikiSearch('') }}
                >
                  ×
                </button>
              )}
            </div>
            {wikiDropdownOpen && (
              <ul className="wiki-dropdown">
                {filteredWikis.map(w => (
                  <li
                    key={w.id}
                    className={`wiki-option${selectedWiki?.id === w.id ? ' selected' : ''}`}
                    onMouseDown={() => {
                      setSelectedWiki(w)
                      setWikiSearch('')
                      setWikiDropdownOpen(false)
                    }}
                  >
                    {w.name}
                  </li>
                ))}
                {filteredWikis.length === 0 && (
                  <li className="wiki-option-empty">No wikis found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="filter-row">
          <span className="filter-label">🏷️ Flair</span>
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryEmoji(cat)} {cat === 'All' ? 'All' : displayCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Search + sort */}
        <div className="filter-row">
          <span className="filter-label">🔍 Search & Sort</span>
          <div className="search-sort-bar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="thread-search"
                placeholder="Search threads…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sort-pills">
              {[
                ['latest',  '🕐', 'Latest'],
                ['liked',   '❤️', 'Most Liked'],
                ['replies', '💬', 'Most Replies'],
              ].map(([key, icon, label]) => (
                <button
                  key={key}
                  className={`sort-pill${sortBy === key ? ' active' : ''}`}
                  onClick={() => setSortBy(key)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thread list */}
      <div className="thread-list">
        {visibleThreads.length === 0
          ? <p className="no-threads">No threads found.</p>
          : visibleThreads.map(t => (
              <ThreadCard
                key={t.thread_id}
                thread={t}
                onSelect={() => setSelectedThread(t)}
              />
            ))
        }
      </div>
    </div>
  )
}
