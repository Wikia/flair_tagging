export const FLAIRS = [
  { id: 'fanfic',   label: 'FanFic',     emoji: '📖' },
  { id: 'trading',  label: 'Trading',    emoji: '💰' },
  { id: 'event',    label: 'Event',      emoji: '🎉' },
  { id: 'ranking',  label: 'Ranking',    emoji: '🏆' },
  { id: 'poll',     label: 'Poll',       emoji: '📊' },
  { id: 'launch',   label: 'New Launch', emoji: '🚀' },
  { id: 'opinion',  label: 'Opinion',    emoji: '💭' },
  { id: 'theories', label: 'Theories',   emoji: '🔮' },
  { id: 'meme',     label: 'Meme',       emoji: '😂' },
  { id: 'puzzle',   label: 'Puzzle',     emoji: '🧩' },
]

const CATEGORY_TO_FLAIR = {
  fanfic: 'fanfic', Fanfic: 'fanfic',
  trading: 'trading', Trading: 'trading',
  event: 'event', Event: 'event',
  ranking: 'ranking', Ranking: 'ranking',
  poll: 'poll', Poll: 'poll',
  'New Launch': 'launch', launch: 'launch',
  opinion: 'opinion', Opinion: 'opinion',
  theories: 'theories', Theories: 'theories',
  meme: 'meme', Meme: 'meme',
  puzzle: 'puzzle', Puzzle: 'puzzle',
}

export function normalizeFlair(category) {
  return CATEGORY_TO_FLAIR[category] || null
}

const KNOWN_ACCENTS = {
  'adopt me': '#E87FBF',
  'dragon adventures': '#7A4CC2',
  'grow a garden': '#4C9A3A',
  'one piece': '#1EA7B8',
  'naruto': '#E87B1A',
  'boku no hero': '#1A7A3C',
  'project sekai': '#9B2DBE',
  'battle for dream island': '#1A78C8',
  'sponge': '#C8B01A',
  'marvel': '#C8101A',
  'star wars': '#C8A21A',
  'disney': '#1A3A8C',
  'forsaken': '#B03030',
  'agartha': '#4A8AC8',
  'singing monsters': '#E0821A',
}

const ACCENT_PALETTE = ['#1EA7B8', '#7A4CC2', '#4C9A3A', '#E87B1A', '#C8101A', '#C8A21A', '#E87FBF']

function wikiAccent(name) {
  const lower = name.toLowerCase()
  for (const [key, color] of Object.entries(KNOWN_ACCENTS)) {
    if (lower.includes(key)) return color
  }
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length]
}

export function getWikiTheme(wikiName) {
  if (!wikiName) return { theme: 'default', accent: '#E8375C' }
  const lower = wikiName.toLowerCase()
  if (lower.includes('dandy')) return { theme: 'dandys', accent: '#FF4FAD' }
  if (lower.includes('hunger')) return { theme: 'hunger', accent: '#E8A020' }
  return { theme: 'color', accent: wikiAccent(wikiName) }
}
