import { useState, useEffect } from 'react'
import { FLAIRS } from '../constants'
import { classNames } from '../utils'

export function WhatsOnMind({ onOpen }) {
  return (
    <div className="whats-on-mind" onClick={onOpen} role="button" tabIndex={0}>
      <div className="wom-avatar">A</div>
      <div className="wom-prompt">What's on your mind?</div>
      <div className="wom-actions">
        <div className="wom-icon" title="Text">✏️</div>
        <div className="wom-icon" title="Image">🖼️</div>
        <div className="wom-icon" title="Link">🔗</div>
      </div>
    </div>
  )
}

export function Composer({ onClose, onSubmit }) {
  const [kind, setKind] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [flair, setFlair] = useState(null)

  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  const canPost = (() => {
    if (!title.trim()) return false
    if (kind === 'text') return content.trim().length > 0
    if (kind === 'image') return true
    if (kind === 'link') return linkUrl.trim().length > 0
    return false
  })()

  function submit() {
    if (!canPost) return
    onSubmit({ kind, title: title.trim(), content: (content.trim() || linkUrl.trim()), flair })
  }

  return (
    <div className="composer-backdrop" onClick={onClose}>
      <div className="composer" onClick={e => e.stopPropagation()}>
        <div className="composer-head">
          <div className="composer-head-title">Create a post</div>
          <button className="composer-close" onClick={onClose}>✕</button>
        </div>

        <div className="composer-body">
          {/* Flair row — inline, no dropdown */}
          <div className="composer-flair-row">
            {FLAIRS.map(f => (
              <button
                key={f.id}
                className={classNames('composer-flair-btn', flair === f.id && 'active')}
                onClick={() => setFlair(flair === f.id ? null : f.id)}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          <input
            className="composer-title-input"
            placeholder="An interesting title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />

          {kind === 'text' && (
            <textarea
              className="composer-textarea"
              placeholder="Share your thoughts with the fandom…"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          )}

          {kind === 'image' && (
            <>
              <div className="composer-image-drop">📷 Drag &amp; drop an image, or click to browse</div>
              <textarea
                className="composer-textarea"
                placeholder="Add a caption (optional)"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </>
          )}

          {kind === 'link' && (
            <>
              <input
                className="composer-link-input"
                placeholder="https://…"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
              />
              <textarea
                className="composer-textarea"
                placeholder="Why is this worth reading? (optional)"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </>
          )}

          {/* Content type tabs — below the text area */}
          <div className="kind-tabs" style={{ marginTop: 10 }}>
            {[
              { id: 'text',  label: '✏️ Text' },
              { id: 'image', label: '🖼️ Image' },
              { id: 'link',  label: '🔗 Link' },
            ].map(k => (
              <button key={k.id}
                className={classNames('kind-tab', kind === k.id && 'active')}
                onClick={() => setKind(k.id)}
              >{k.label}</button>
            ))}
          </div>
        </div>

        <div className="composer-foot">
          <button className="btn-primary" disabled={!canPost} onClick={submit}>Post</button>
        </div>
      </div>
    </div>
  )
}
