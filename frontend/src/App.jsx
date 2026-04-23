import { useState, useEffect, useMemo, useCallback } from 'react'
import FandomChrome from './components/Chrome'
import AppHeader from './components/AppHeader'
import { WhatsOnMind, Composer } from './components/Composer'
import ControlsPanel from './components/Controls'
import Feed from './components/Feed'
import ThreadDetail from './components/ThreadDetail'
import { FLAIRS, normalizeFlair, getWikiTheme } from './constants'

// ─── Data loading ──────────────────────────────────────────────────────────

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
    const replies = sorted.filter(p => p !== op)
    const latest_ts = sorted.reduce((m, p) => (p.post_time > m ? p.post_time : m), '')
    const likes_total = sorted.reduce((s, p) => s + (p.n_likes || 0), 0)
    const flair = normalizeFlair(op.category || '')

    return {
      thread_id: String(op.thread_id),
      wiki_id: op.wiki_id,
      wiki_name: op.wiki_name,
      flair,
      op: {
        post_id: String(op.post_id),
        author: op.user_name || 'Anonymous',
        ts: op.post_time,
        title: op.title || 'Untitled',
        content: op.content || '',
        flair,
        likes: op.n_likes || 0,
      },
      replies: replies.map(r => ({
        post_id: String(r.post_id),
        author: r.user_name || 'Anonymous',
        ts: r.post_time,
        content: r.content || '',
        likes: r.n_likes || 0,
      })),
      likes_total,
      reply_count: replies.length,
      last_ts: latest_ts,
    }
  })
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [rawThreads, setRawThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [userThreads, setUserThreads] = useState([])
  const [userReplies, setUserReplies] = useState({})

  const [selectedWiki, setSelectedWiki] = useState(null)
  const [flair, setFlair] = useState(null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('latest')
  const [layout, setLayout] = useState('cozy')
  const [composerOpen, setComposerOpen] = useState(false)
  const [openThreadId, setOpenThreadId] = useState(null)
  const [likedPosts, setLikedPosts] = useState({})
  const [likedThreads, setLikedThreads] = useState({})
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    fetch('/data/sample_export.json')
      .then(r => r.json())
      .then(data => { setRawThreads(buildThreads(data)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // ─── Derived wiki list ────────────────────────────────────────────────────

  const wikis = useMemo(() => {
    const seen = {}
    rawThreads.forEach(t => {
      if (t.wiki_id && !seen[t.wiki_id]) {
        const themeInfo = getWikiTheme(t.wiki_name)
        seen[t.wiki_id] = { id: t.wiki_id, name: t.wiki_name, ...themeInfo }
      }
    })
    return Object.values(seen).sort((a, b) => a.name.localeCompare(b.name))
  }, [rawThreads])

  // ─── Theme application ─────────────────────────────────────────────────────

  useEffect(() => {
    const themeInfo = selectedWiki ? getWikiTheme(selectedWiki.name) : { theme: 'default', accent: '#E8375C' }
    document.documentElement.setAttribute('data-theme', themeInfo.theme)
    if (themeInfo.theme === 'color') {
      document.documentElement.style.setProperty('--accent-dynamic', themeInfo.accent)
      document.documentElement.style.setProperty('--accent-tint',
        `color-mix(in srgb, ${themeInfo.accent} 8%, #FDFCFA)`)
    } else {
      document.documentElement.style.removeProperty('--accent-dynamic')
      document.documentElement.style.removeProperty('--accent-tint')
    }
  }, [selectedWiki])

  // ─── All threads (real + user-created) ────────────────────────────────────

  const allThreads = useMemo(() => {
    const all = [...userThreads, ...rawThreads]
    return all.map(t => {
      const extra = userReplies[t.thread_id] || []
      if (!extra.length) return t
      return {
        ...t,
        replies: [...t.replies, ...extra],
        reply_count: t.replies.length + extra.length,
        likes_total: t.likes_total + extra.reduce((s, r) => s + (r.likes || 0), 0),
        last_ts: extra[extra.length - 1].ts,
      }
    })
  }, [rawThreads, userThreads, userReplies])

  // ─── Wiki-scoped + filtered threads ───────────────────────────────────────

  const wikiScoped = useMemo(() => {
    if (!selectedWiki) return allThreads
    return allThreads.filter(t => t.wiki_id === selectedWiki.id)
  }, [allThreads, selectedWiki])

  const flairCounts = useMemo(() => {
    const c = { __all: wikiScoped.length }
    for (const t of wikiScoped) {
      if (t.flair) c[t.flair] = (c[t.flair] || 0) + 1
    }
    return c
  }, [wikiScoped])

  const threads = useMemo(() => {
    let list = wikiScoped
    if (flair) list = list.filter(t => t.flair === flair)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(t =>
        t.op.title.toLowerCase().includes(q) ||
        t.op.content.toLowerCase().includes(q)
      )
    }
    const sorted = [...list]
    if (sort === 'latest')  sorted.sort((a, b) => b.last_ts.localeCompare(a.last_ts))
    if (sort === 'liked')   sorted.sort((a, b) => b.likes_total - a.likes_total)
    if (sort === 'replies') sorted.sort((a, b) => b.reply_count - a.reply_count)
    return sorted
  }, [wikiScoped, flair, query, sort])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const onPickWiki = useCallback(w => {
    setSelectedWiki(w); setFlair(null); setOpenThreadId(null)
  }, [])

  const onClearWiki = useCallback(() => {
    setSelectedWiki(null); setFlair(null); setOpenThreadId(null)
  }, [])

  const onToggleLikeThread = useCallback(id => {
    setLikedThreads(s => ({ ...s, [id]: !s[id] }))
  }, [])

  const onToggleLikePost = useCallback(postId => {
    setLikedPosts(s => ({ ...s, [postId]: !s[postId] }))
  }, [])

  const fireConfetti = useCallback(() => {
    const picks = ['✨', '🎉', '⭐', '🎊', '💫']
    const pieces = Array.from({ length: 22 }, (_, i) => ({
      id: Date.now() + '-' + i,
      emoji: picks[i % picks.length],
      x: `${Math.random() * 100}vw`,
      dx: `${(Math.random() - 0.5) * 200}px`,
      r: `${(Math.random() - 0.5) * 720}deg`,
      delay: `${Math.random() * 0.2}s`,
    }))
    setConfetti(pieces)
    setTimeout(() => setConfetti([]), 1600)
  }, [])

  const onPostSubmit = useCallback(({ title, content, flair: f }) => {
    const tid = 't-user-' + Date.now()
    const pid = 'p-user-' + Date.now()
    const now = new Date().toISOString()
    const flairId = normalizeFlair(f) || f
    setUserThreads(prev => [{
      thread_id: tid,
      wiki_id: selectedWiki?.id || null,
      wiki_name: selectedWiki?.name || null,
      flair: flairId,
      op: { post_id: pid, author: 'You', ts: now, title, content, flair: flairId, likes: 0 },
      replies: [],
      likes_total: 0,
      reply_count: 0,
      last_ts: now,
    }, ...prev])
    setComposerOpen(false)
    fireConfetti()
  }, [selectedWiki, fireConfetti])

  const onReply = useCallback(text => {
    if (!openThreadId) return
    const pid = 'r-user-' + Date.now()
    const now = new Date().toISOString()
    setUserReplies(s => ({
      ...s,
      [openThreadId]: [...(s[openThreadId] || []), {
        post_id: pid, author: 'You', ts: now, content: text, likes: 0,
      }],
    }))
  }, [openThreadId])

  const openThread = openThreadId
    ? (threads.find(t => t.thread_id === openThreadId) || allThreads.find(t => t.thread_id === openThreadId))
    : null

  const activeWikiInfo = selectedWiki ? getWikiTheme(selectedWiki.name) : null
  const headerWiki = selectedWiki ? { name: selectedWiki.name, ...activeWikiInfo } : null

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', fontSize: 14, color: 'var(--fg-subtle)' }}>
        Loading threads…
      </div>
    )
  }

  return (
    <FandomChrome>
      <div className="app">
        <AppHeader wiki={headerWiki} />

        <main className="main">
          {!openThread && (
            <>
              <WhatsOnMind onOpen={() => setComposerOpen(true)} />
              <ControlsPanel
                wiki={selectedWiki}
                wikis={wikis}
                onPickWiki={onPickWiki}
                onClearWiki={onClearWiki}
                flair={flair}
                onFlair={setFlair}
                query={query}
                onQuery={setQuery}
                sort={sort}
                onSort={setSort}
                layout={layout}
                onLayout={setLayout}
                flairCounts={flairCounts}
              />
              <div className="feed-head">
                <div className="feed-count">
                  <strong>{threads.length}</strong> {threads.length === 1 ? 'thread' : 'threads'}
                  {flair && ` · ${FLAIRS.find(f => f.id === flair)?.label}`}
                  {selectedWiki && ` · ${selectedWiki.name}`}
                </div>
              </div>
              <Feed
                threads={threads}
                layout={layout}
                onOpen={setOpenThreadId}
                onLike={onToggleLikeThread}
                likedThreads={likedThreads}
              />
            </>
          )}

          {openThread && (
            <ThreadDetail
              thread={openThread}
              onBack={() => setOpenThreadId(null)}
              onLikeOp={onToggleLikePost}
              onLikeReply={onToggleLikePost}
              onReply={onReply}
              likedPosts={likedPosts}
            />
          )}
        </main>

        {composerOpen && (
          <Composer onClose={() => setComposerOpen(false)} onSubmit={onPostSubmit} />
        )}

        {confetti.length > 0 && (
          <div className="confetti">
            {confetti.map(c => (
              <span key={c.id} style={{ '--x': c.x, '--dx': c.dx, '--r': c.r, animationDelay: c.delay }}>
                {c.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </FandomChrome>
  )
}
