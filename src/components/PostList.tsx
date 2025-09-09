import React, { useEffect } from 'react'
import axios from 'axios'
import { useStore } from '../store/useStore'

const PostList: React.FC = () => {
  const { posts, loading, error, selectedUser, setPosts, setLoading, setError, addPost, clearError } = useStore()

  // Fetch posts when a user is selected
  useEffect(() => {
    if (!selectedUser) {
      setPosts([])
      return
    }

    const fetchPosts = async () => {
      try {
        setLoading(true)
        clearError()
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUser.id}`)
        setPosts(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedUser, setPosts, setLoading, setError, clearError])

  const handleAddPost = async () => {
    if (!selectedUser) return

    try {
      setLoading(true)
      clearError()
      
      // Create a new post
      const newPost = {
        title: `New Post for ${selectedUser.name}`,
        body: 'This is a new post created via Axios POST request.',
        userId: selectedUser.id,
      }

      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost)
      
      // Add the new post to our store (with the ID returned from the server)
      addPost({
        ...newPost,
        id: response.data.id,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedUser) {
    return (
      <div className="card">
        <h2>Posts</h2>
        <p>Select a user to see their posts</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <h2>Posts by {selectedUser.name}</h2>
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h2>Posts by {selectedUser.name}</h2>
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Posts by {selectedUser.name} ({posts.length})</h2>
      <button onClick={handleAddPost} disabled={loading}>
        Add New Post
      </button>
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <div className="post-title">{post.title}</div>
          <div className="post-body">{post.body}</div>
        </div>
      ))}
    </div>
  )
}

export default PostList
