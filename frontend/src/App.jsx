import React, { useState, useEffect } from 'react'
import PostEntry from './components/PostEntry'
import DiscussionTab from './components/DiscussionTab'

// Helpers to build theme objects
function lightTheme(accent, accentDark, accentLight, bg, decoration = null, key = null) {
  return {
    key, decoration,
    accent, accentDark, accentLight, bg,
    cardBg: '#ffffff', cardText: '#18181b', cardTextSec: '#71717a',
    inputBg: '#fafafa',
    controlsBg: '#ffffff', controlsBorder: '#e4e4e7',
    pillBg: '#f4f4f5', pillText: '#52525b', pillBorder: '#e4e4e7', pillHover: '#e9e9eb',
    activePillBg: '#18181b', activePillText: '#ffffff',
    badgeBg: accentLight, badgeText: accentDark,
  }
}

function darkTheme(accent, accentDark, bg, cardBg, cardText, cardTextSec, controlsBg, controlsBorder, decoration = null, key = null) {
  return {
    key, decoration,
    accent, accentDark,
    accentLight: 'transparent',
    bg, cardBg, cardText, cardTextSec,
    inputBg: cardBg,
    controlsBg, controlsBorder,
    pillBg: 'rgba(255,255,255,0.07)', pillText: cardTextSec, pillBorder: 'rgba(255,255,255,0.13)', pillHover: 'rgba(255,255,255,0.12)',
    activePillBg: accent, activePillText: bg,
    badgeBg: `${accent}33`, badgeText: accent,
  }
}

const FANDOM_THEME = lightTheme('#E8375C', '#C82A4A', '#FFD5DC', '#FDF5EC')

const WIKI_THEMES = {
  // ── Wikis with full image theming ───────────────────────────────
  'Harry Potter': darkTheme(
    '#C9A84C', '#A07830',
    '#080C18', '#111827', '#E8DCC8', '#7A6848',
    '#0D1420', '#2C3E5A',
    '⚡ 🏰 🪄 🦉', 'harry-potter'
  ),
  "Dandy's World Wiki": lightTheme(
    '#FF4FAD', '#D93898', '#FFE0F4', '#FFF0FC',
    '👁️ 🎪 🃏 💀', 'dandy'
  ),
  'Hunger Games': darkTheme(
    '#E8A020', '#B87010',
    '#080402', '#160B04', '#F0DEB8', '#8C6030',
    '#100600', '#3A2010',
    '🔥 🏹 🪶 ⚔️', 'hunger-games'
  ),

  // ── Remaining wikis (color-only theming) ────────────────────────
  'Dragon Adventures Wiki':       lightTheme('#7B2FBE', '#5C1FA0', '#EFE0FF', '#F8F2FF'),
  'Roblox Grow a Garden Wiki':    lightTheme('#2D8B4E', '#1F6B3A', '#D9F2E3', '#F0FBF4'),
  'Adopt Me Wiki':                lightTheme('#E87FBF', '#D060A8', '#FFE0F3', '#FFF5FB'),
  'FORSAKEN Wiki':                darkTheme('#B03030', '#8A1A1A', '#0D0505', '#1A0808', '#F0DADA', '#804040', '#130404', '#3A1010', '💀 ⚔️', null),
  'Creatures of Agartha Wiki':    darkTheme('#4A8AC8', '#2A6AA8', '#050A12', '#0C1626', '#D0E4F8', '#5A7898', '#081020', '#1A3050', '🌊 🐉', null),
  'Die of Death Wiki':            darkTheme('#888888', '#666666', '#080808', '#141414', '#E8E8E8', '#888888', '#0E0E0E', '#303030', '💀 ☠️', null),
  'My Singing Monsters Wiki':     lightTheme('#E0821A', '#C06810', '#FFE8C8', '#FFF7ED', '🎵 🎪 🎶', null),
  'Boku no Hero Academia Wiki':   lightTheme('#1A7A3C', '#0F5C28', '#D5F0E0', '#EDFBF3', '⚡ 💪 🦸', null),
  'One Piece':                    lightTheme('#C8961A', '#A87808', '#FFF0C8', '#FFFAED', '⚓ 🏴‍☠️ 🌊', null),
  'Narutopedia':                  lightTheme('#E87B1A', '#C86008', '#FFE6C8', '#FFF7ED', '🍃 ⚡ 🌀', null),
  'Project SEKAI Wiki':           lightTheme('#9B2DBE', '#7B0DA0', '#F0D5FF', '#F8EEFF', '🎵 🌸 ✨', null),
  'Battle for Dream Island Wiki': lightTheme('#1A78C8', '#0F5EA8', '#D5EAFF', '#EEF6FF', '🏆 ⭐ 🎯', null),
  'Disney Wiki':                  lightTheme('#1A3A8C', '#0F2A78', '#D5E0FF', '#EEF2FF', '✨ 🏰 🌟', null),
  'Encyclopedia SpongeBobia':     lightTheme('#C8B01A', '#A89008', '#FFF5C8', '#FFFCED', '🧽 🍍 🌊', null),
  'Marvel':                       darkTheme('#C8101A', '#A80008', '#0A0204', '#1A0408', '#F8E8E8', '#A05050', '#120206', '#3A0810', '🦸 ⚡ 🛡️', null),
  'Star Wars':                    darkTheme('#C8A21A', '#A88208', '#050504', '#121008', '#F8F0C8', '#907830', '#0C0A04', '#302810', '⚔️ 🚀 🌌', null),
}

export default function App() {
  const [wikiName, setWikiName] = useState(null)
  const [threadOpen, setThreadOpen] = useState(false)
  const theme = wikiName ? (WIKI_THEMES[wikiName] ?? FANDOM_THEME) : FANDOM_THEME

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--accent',           theme.accent)
    r.style.setProperty('--accent-dark',      theme.accentDark)
    r.style.setProperty('--accent-light',     theme.accentLight)
    r.style.setProperty('--bg',               theme.bg)
    r.style.setProperty('--card-bg',          theme.cardBg)
    r.style.setProperty('--card-text',        theme.cardText)
    r.style.setProperty('--card-text-sec',    theme.cardTextSec)
    r.style.setProperty('--input-bg',         theme.inputBg)
    r.style.setProperty('--controls-bg',      theme.controlsBg)
    r.style.setProperty('--controls-border',  theme.controlsBorder)
    r.style.setProperty('--pill-bg',          theme.pillBg)
    r.style.setProperty('--pill-text',        theme.pillText)
    r.style.setProperty('--pill-border',      theme.pillBorder)
    r.style.setProperty('--pill-hover',       theme.pillHover)
    r.style.setProperty('--active-pill-bg',   theme.activePillBg)
    r.style.setProperty('--active-pill-text', theme.activePillText)
    r.style.setProperty('--badge-bg',         theme.badgeBg)
    r.style.setProperty('--badge-text',       theme.badgeText)
  }, [theme])

  return (
    <div className="app" data-wiki={theme.key ?? 'default'}>
      <div className="app-header">
        <div className="app-logo-wrap">
          <img src="/image/fandom-icon.png" alt="Fandom" className="app-logo" />
        </div>
        <div className="app-header-text">
          <div className="app-brand">{wikiName ?? 'Fandom'} Discussions</div>
          {wikiName && <div className="app-wiki-label">powered by Fandom</div>}
        </div>
        {theme.decoration && (
          <div className="app-decoration">{theme.decoration}</div>
        )}
      </div>
      <div className="app-content">
        {!threadOpen && <PostEntry />}
        <DiscussionTab onWikiChange={setWikiName} onThreadSelect={setThreadOpen} />
      </div>
    </div>
  )
}
