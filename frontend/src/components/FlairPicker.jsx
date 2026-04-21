import React, { useState, useRef, useEffect } from 'react'

const FLAIRS = ['FanFic', 'Trading', 'Event', 'Ranking', 'Poll', 'New Launch', 'Opinion', 'Theories']

export default function FlairPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flair-picker" ref={ref}>
      <button className="flair-trigger" onClick={() => setOpen(o => !o)}>
        {value ?? '+ Flair'}
      </button>
      {open && (
        <ul className="flair-dropdown">
          {value && (
            <li className="flair-option flair-clear" onClick={() => { onChange(null); setOpen(false) }}>
              Clear
            </li>
          )}
          {FLAIRS.map(f => (
            <li
              key={f}
              className={`flair-option${value === f ? ' selected' : ''}`}
              onClick={() => { onChange(f); setOpen(false) }}
            >
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
