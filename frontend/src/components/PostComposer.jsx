import React, { useState } from 'react'
import FlairPicker from './FlairPicker'

const TABS = ['Text', 'Image', 'Link']

export default function PostComposer({ onClose, onSubmit }) {
  const [tab, setTab] = useState('Text')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [flair, setFlair] = useState(null)

  function handleSubmit() {
    const post = { type: tab.toLowerCase(), flair }
    if (tab === 'Text') post.content = text
    if (tab === 'Image') post.file = imageFile
    if (tab === 'Link') post.url = linkUrl
    onSubmit(post)
    onClose()
  }

  const canSubmit =
    (tab === 'Text' && text.trim()) ||
    (tab === 'Image' && imageFile) ||
    (tab === 'Link' && linkUrl.trim())

  return (
    <div className="composer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="composer">
        <div className="composer-header">
          <span className="composer-title">Create Post</span>
          <FlairPicker value={flair} onChange={setFlair} />
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
