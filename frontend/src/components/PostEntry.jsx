import React, { useState } from 'react'
import PostComposer from './PostComposer'

export default function PostEntry() {
  const [composerOpen, setComposerOpen] = useState(false)
  const [posts, setPosts] = useState([])

  function handleSubmit(post) {
    setPosts(prev => [{ ...post, id: Date.now() }, ...prev])
  }

  return (
    <div className="feed">
      <div className="entry-box" onClick={() => setComposerOpen(true)}>
        What's on your mind?
      </div>

      {composerOpen && (
        <PostComposer
          onClose={() => setComposerOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {post.flair && <span className="post-flair">{post.flair}</span>}
            <p className="post-type">{post.type}</p>
            {post.content && <p>{post.content}</p>}
            {post.file && <p>{post.file.name}</p>}
            {post.url && <a href={post.url} target="_blank" rel="noreferrer">{post.url}</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
