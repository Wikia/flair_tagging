import { Avatar, FlairBadge, LikeButton } from './Shared'
import { FLAIRS } from '../constants'
import { relativeTime, classNames } from '../utils'

function CozyCard({ thread, onOpen, onLike, liked }) {
  return (
    <div className="card" onClick={() => onOpen(thread.thread_id)}>
      <div className="card-row-top">
        <Avatar name={thread.op.author} />
        <div className="author-chip">
          <span className="name">{thread.op.author}</span>
          <span className="meta">{relativeTime(thread.op.ts)}</span>
        </div>
        <div style={{ flex: 1 }} />
        <FlairBadge flair={thread.flair} />
      </div>
      <div className="card-title">{thread.op.title}</div>
      <div className="card-excerpt">{thread.op.content}</div>
      <div className="card-foot">
        <div className="card-stats">
          <span className="stat">💬 {thread.reply_count}</span>
        </div>
        <LikeButton
          liked={liked}
          count={thread.likes_total + (liked ? 1 : 0)}
          onClick={() => onLike(thread.thread_id)}
        />
      </div>
    </div>
  )
}

function CompactCard({ thread, onOpen, onLike, liked }) {
  return (
    <div className="card compact" onClick={() => onOpen(thread.thread_id)}>
      <Avatar name={thread.op.author} />
      <div className="compact-main">
        <div className="compact-title">
          <FlairBadge flair={thread.flair} />
          {thread.op.title}
        </div>
        <div className="compact-meta">
          <span>{thread.op.author}</span>
          <span>{relativeTime(thread.op.ts)}</span>
        </div>
      </div>
      <div className="compact-stats" onClick={e => e.stopPropagation()}>
        <span>💬 {thread.reply_count}</span>
        <LikeButton
          liked={liked}
          count={thread.likes_total + (liked ? 1 : 0)}
          onClick={() => onLike(thread.thread_id)}
        />
      </div>
    </div>
  )
}

function MagazineCard({ thread, onOpen, onLike, liked }) {
  const flairDef = FLAIRS.find(f => f.id === thread.flair)
  return (
    <div className="card magazine" onClick={() => onOpen(thread.thread_id)}>
      <div className="mag-head"
        data-decor={flairDef ? flairDef.emoji : '✨'}
        data-flair={flairDef ? flairDef.label : 'DISCUSSION'}
      />
      <div className="mag-body">
        <div className="card-row-top">
          <Avatar name={thread.op.author} />
          <div className="author-chip">
            <span className="name">{thread.op.author}</span>
            <span className="meta">{relativeTime(thread.op.ts)}</span>
          </div>
        </div>
        <div className="card-title">{thread.op.title}</div>
        <div className="card-excerpt">{thread.op.content}</div>
        <div className="card-foot">
          <div className="card-stats">
            <span className="stat">💬 {thread.reply_count}</span>
          </div>
          <LikeButton
            liked={liked}
            count={thread.likes_total + (liked ? 1 : 0)}
            onClick={() => onLike(thread.thread_id)}
          />
        </div>
      </div>
    </div>
  )
}

export default function Feed({ threads, layout, onOpen, onLike, likedThreads }) {
  if (threads.length === 0) {
    return (
      <div className="empty">
        <div className="big">🕸️</div>
        <div>No threads match your filters.</div>
        <div style={{ fontSize: 13, marginTop: 6, opacity: 0.7 }}>
          Try clearing search, flair, or wiki.
        </div>
      </div>
    )
  }

  const Card = layout === 'compact' ? CompactCard : layout === 'magazine' ? MagazineCard : CozyCard

  return (
    <div className={classNames('feed', layout)}>
      {threads.map(t => (
        <Card
          key={t.thread_id}
          thread={t}
          onOpen={onOpen}
          onLike={onLike}
          liked={!!likedThreads[t.thread_id]}
        />
      ))}
    </div>
  )
}
