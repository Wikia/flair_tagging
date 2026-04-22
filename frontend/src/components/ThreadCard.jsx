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
  const now = new Date()
  const days = Math.floor((now - d) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export default function ThreadCard({ thread, onSelect }) {
  const { title, content, user_name, post_time, category, reply_count, total_likes } = thread
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(total_likes)

  function handleLike(e) {
    e.stopPropagation()
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  const displayTitle = title || 'Untitled thread'
  const excerpt = (content || '').slice(0, 120) + ((content || '').length > 120 ? '…' : '')
  const color = avatarColor(user_name)

  return (
    <div className="thread-card" onClick={onSelect}>
      <div className="thread-card-top">
        <div className="thread-card-meta">
          <div className="avatar" style={{ background: color }}>{user_name[0]}</div>
          <span className="thread-author">{user_name}</span>
          <span className="thread-date">{formatDate(post_time)}</span>
        </div>
        {category && (
          <span className="flair-badge">{getCategoryEmoji(category)} {displayCategory(category)}</span>
        )}
      </div>
      <div className="thread-card-body">
        <h3 className="thread-title">{displayTitle}</h3>
        {excerpt && <p className="thread-excerpt">{excerpt}</p>}
      </div>
      <div className="thread-card-footer">
        <span className="thread-stat">💬 {reply_count}</span>
        <button className={`like-btn-inline${liked ? ' liked' : ''}`} onClick={handleLike}>
          ❤️ {likeCount}
        </button>
      </div>
    </div>
  )
}
