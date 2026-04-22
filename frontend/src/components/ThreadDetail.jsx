import React, { useState } from 'react'
import { displayCategory, getCategoryEmoji } from './DiscussionTab'

const AVATAR_COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2']

function avatarColor(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ThreadDetail({ thread, onBack }) {
  const { title, category, posts } = thread
  const op = posts.find(p => p.post_role === 'op') ?? posts[0]
  const initialReplies = posts.filter(p => p !== op)

  const [replies, setReplies] = useState(initialReplies)
  const [replyText, setReplyText] = useState('')
  const [likedIds, setLikedIds] = useState(new Set())
  const [likeCounts, setLikeCounts] = useState(() => {
    const map = {}
    posts.forEach(p => { map[String(p.post_id)] = p.n_likes || 0 })
    return map
  })

  function toggleLike(postId) {
    const id = String(postId)
    setLikedIds(prev => {
      const next = new Set(prev)
      const wasLiked = next.has(id)
      if (wasLiked) next.delete(id)
      else next.add(id)
      setLikeCounts(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + (wasLiked ? -1 : 1)) }))
      return next
    })
  }

  function submitReply() {
    if (!replyText.trim()) return
    const newId = Date.now()
    setReplies(prev => [...prev, {
      post_id: newId,
      post_role: 'reply',
      user_name: 'You',
      post_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      content: replyText.trim(),
      n_likes: 0,
    }])
    setLikeCounts(c => ({ ...c, [String(newId)]: 0 }))
    setReplyText('')
  }

  return (
    <div className="thread-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>

      {/* Original post */}
      <div className="detail-op">
        <div className="detail-op-header">
          <div className="detail-meta">
            <div className="avatar" style={{ background: avatarColor(op.user_name) }}>
              {op.user_name[0]}
            </div>
            <div>
              <span className="thread-author">{op.user_name}</span>
              <span className="thread-date">{formatDate(op.post_time)}</span>
            </div>
          </div>
          {category && <span className="flair-badge">{getCategoryEmoji(category)} {displayCategory(category)}</span>}
        </div>
        {title && <h2 className="detail-title">{title}</h2>}
        {op.content && <p className="detail-content">{op.content}</p>}
        <div className="detail-op-footer">
          <button
            className={`like-btn${likedIds.has(String(op.post_id)) ? ' liked' : ''}`}
            onClick={() => toggleLike(op.post_id)}
          >
            ❤️<span>{likeCounts[String(op.post_id)] ?? 0}</span>
          </button>
        </div>
      </div>

      {/* Replies */}
      <div className="detail-replies">
        {replies.length > 0 && (
          <p className="replies-label">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</p>
        )}
        {replies.map(r => {
          const id = String(r.post_id)
          const isLiked = likedIds.has(id)
          const count = likeCounts[id] ?? 0
          return (
            <div key={id} className={`reply-item${isLiked ? ' liked' : ''}`}>
              <div className="reply-header">
                <div className="avatar sm" style={{ background: avatarColor(r.user_name) }}>
                  {r.user_name[0]}
                </div>
                <span className="thread-author">{r.user_name}</span>
                <span className="thread-date">{formatDate(r.post_time)}</span>
              </div>
              {r.content && <p className="reply-content">{r.content}</p>}
              <div className="reply-footer">
                <button
                  className={`like-btn${isLiked ? ' liked' : ''}`}
                  onClick={() => toggleLike(r.post_id)}
                >
                  ❤️<span>{count}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating reply bar */}
      <div className="reply-composer">
        <textarea
          className="reply-input"
          placeholder="💬 Write a reply…"
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          rows={1}
        />
        <button className="btn-submit" disabled={!replyText.trim()} onClick={submitReply}>
          Reply
        </button>
      </div>
    </div>
  )
}
