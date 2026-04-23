import { avatarColor, classNames } from '../utils'
import { FLAIRS } from '../constants'

export function Avatar({ name, size = 'md' }) {
  return (
    <div
      className={classNames('avatar', size === 'lg' && 'avatar-lg')}
      style={{ background: avatarColor(name || '?') }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
}

export function FlairBadge({ flair }) {
  if (!flair) return null
  const f = FLAIRS.find(x => x.id === flair)
  if (!f) return null
  return (
    <span className="flair-badge">
      <span className="emoji">{f.emoji}</span>
      {f.label}
    </span>
  )
}

export function LikeButton({ liked, count, onClick }) {
  return (
    <button
      className={classNames('like-btn', liked && 'liked')}
      onClick={e => { e.stopPropagation(); onClick() }}
      aria-pressed={liked}
    >
      <span className="heart">{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}
