import React, { useState } from 'react'
import PostComposer from './PostComposer'

export default function PostEntry({ onNewPost }) {
  const [composerOpen, setComposerOpen] = useState(false)

  function handleSubmit(post) {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const postId = Date.now()
    const content = post.content || post.url || (post.file ? post.file.name : '')
    onNewPost({
      thread_id: `user-${postId}`,
      wiki_id: null,
      wiki_name: null,
      title: post.title,
      content,
      category: post.flair || 'other',
      post_time: now,
      latest_time: now,
      user_name: 'You',
      reply_count: 0,
      total_likes: 0,
      posts: [{
        post_id: postId,
        post_role: 'op',
        user_name: 'You',
        post_time: now,
        content,
        n_likes: 0,
      }],
    })
  }

  return (
    <div>
      <div className="entry-box" onClick={() => setComposerOpen(true)}>
        What's on your mind?
      </div>
      {composerOpen && (
        <PostComposer
          onClose={() => setComposerOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
