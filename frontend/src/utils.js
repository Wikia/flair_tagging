export function relativeTime(iso) {
  const now = new Date()
  const then = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T'))
  const diff = (now - then) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  if (diff < 86400 * 7) return Math.floor(diff / 86400) + 'd ago'
  if (diff < 86400 * 30) return Math.floor(diff / (86400 * 7)) + 'w ago'
  return Math.floor(diff / (86400 * 30)) + 'mo ago'
}

const AVATAR_PALETTE = [
  '#FA005A', '#FFC500', '#6A68CE', '#86D7DC', '#C1690D',
  '#9B004E', '#520044', '#FF4FAD', '#E8A020', '#4C9A3A', '#1EA7B8', '#7A4CC2',
]

export function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length]
}

export function classNames(...xs) {
  return xs.filter(Boolean).join(' ')
}
