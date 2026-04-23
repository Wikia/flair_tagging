import React, { useState } from 'react'

const FLAIRS = [
  { value: 'Fanfic',     label: 'FanFic',     emoji: '📖' },
  { value: 'Trading',    label: 'Trading',    emoji: '💰' },
  { value: 'Event',      label: 'Event',      emoji: '🎉' },
  { value: 'Ranking',    label: 'Ranking',    emoji: '🏆' },
  { value: 'Poll',       label: 'Poll',       emoji: '📊' },
  { value: 'New Launch', label: 'New Launch', emoji: '🆕' },
  { value: 'Opinion',    label: 'Opinion',    emoji: '💡' },
  { value: 'Theories',   label: 'Theories',   emoji: '🔮' },
]

const TABS = ['Text', 'Image', 'Link']

export default function PostComposer({ onClose, onSubmit }) {
  const [tab, setTab] = useState('Text')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [flair, setFlair] = useState(null)

  function handleSubmit() {
    const post = { type: tab.toLowerCase(), flair, title: title.trim() }
    if (tab === 'Text') post.content = text
    if (tab === 'Image') post.file = imageFile
    if (tab === 'Link') post.url = linkUrl
    onSubmit(post)
    onClose()
  }

  const hasContent =
    (tab === 'Text' && text.trim()) ||
    (tab === 'Image' && imageFile) ||
    (tab === 'Link' && linkUrl.trim())

  const canSubmit = title.trim() && hasContent

  return (
    <div className="composer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="composer">
        <div className="composer-header">
          <span className="composer-title">Create Post</span>
        </div>

        <div className="composer-flairs">
          {FLAIRS.map(f => (
            <button
              key={f.value}
              className={`composer-flair-btn${flair === f.value ? ' active' : ''}`}
              onClick={() => setFlair(flair === f.value ? null : f.value)}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        <input
          className="composer-title-input"
          type="text"
          placeholder="Title (required)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="composer-body">
          {tab === 'Text' && (
            <textarea
              placeholder="Write something..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          )}
          {tab === 'Image' && (
            <label className="image-upload">
              {imageFile ? imageFile.name : 'Click to upload an image'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => setImageFile(e.target.files[0] ?? null)}
              />
            </label>
          )}
          {tab === 'Link' && (
            <input
              type="url"
              placeholder="Paste a URL..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
            />
          )}
        </div>

        <div className="composer-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="composer-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit} disabled={!canSubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
