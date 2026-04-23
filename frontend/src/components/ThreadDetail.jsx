import { useState, useEffect } from 'react'
import { Avatar, FlairBadge, LikeButton } from './Shared'
import { relativeTime, classNames } from '../utils'

export default function ThreadDetail({ thread, onBack, onLikeOp, onLikeReply, onReply, likedPosts }) {
  const [replyText, setReplyText] = useState('')

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  const opLiked = !!likedPosts[thread.op.post_id]
  const opLikes = thread.op.likes + (opLiked ? 1 : 0)

  function submit() {
    const t = replyText.trim()
    if (!t) return
    onReply(t)
    setReplyText('')
  }

  return (
    <>
      <div className="detail">
        <button className="back-btn" onClick={onBack}>← Back to threads</button>

        <div className="op-card">
          <div className="op-head">
            <Avatar name={thread.op.author} size="lg" />
            <div className="meta-col">
              <div className="author-chip">
                <span className="name" style={{ fontSize: 15 }}>{thread.op.author}</span>
                <span className="meta">{relativeTime(thread.op.ts)}</span>
              </div>
              <div className="op-title">{thread.op.title}</div>
            </div>
            <FlairBadge flair={thread.flair} />
          </div>
          <div className="op-content">{thread.op.content}</div>
          <div className="op-foot">
            <div className="card-stats">
              <span className="stat">💬 {thread.replies.length} replies</span>
            </div>
            <LikeButton
              liked={opLiked}
              count={opLikes}
              onClick={() => onLikeOp(thread.op.post_id)}
            />
          </div>
        </div>

        <div className="replies-heading">
          <span className="count">{thread.replies.length}</span>
          <span className="label">Replies</span>
        </div>

        {thread.replies.map(r => {
          const liked = !!likedPosts[r.post_id]
          const count = r.likes + (liked ? 1 : 0)
          return (
            <div key={r.post_id} className={classNames('reply-card', liked && 'liked')}>
              <Avatar name={r.author} />
              <div className="reply-main">
                <div className="reply-meta">
                  <span className="name">{r.author}</span>
                  <span className="time">{relativeTime(r.ts)}</span>
                  {liked && <span className="liked-badge">❤️ Liked · {count}</span>}
                </div>
                <div className="reply-body">{r.content}</div>
              </div>
              <div className={classNames('like-col', liked && 'liked')}>
                <button onClick={() => onLikeReply(r.post_id)}>{liked ? '❤️' : '🤍'}</button>
                <span>{count}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="reply-bar">
        <div className="reply-bar-inner">
          <textarea
            className="reply-textarea"
            placeholder="Write a reply…"
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
          />
          <button className="reply-submit" onClick={submit} disabled={!replyText.trim()}>
            Reply
          </button>
        </div>
      </div>
    </>
  )
}
