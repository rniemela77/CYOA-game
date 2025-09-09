import React, { useEffect } from 'react'
import axios from 'axios'
import { useStore } from '../store/useStore'

const UserList: React.FC = () => {
  const { users, loading, error, selectedUser, setUsers, setLoading, setError, setSelectedUser, clearError } = useStore()

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        clearError()
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        setUsers(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [setUsers, setLoading, setError, clearError])

  const handleUserSelect = (user: typeof users[0]) => {
    setSelectedUser(user)
  }

  if (loading) {
    return (
      <div className="card">
        <h2>Users</h2>
        <div className="loading">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <h2>Users</h2>
        <div className="error">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Users ({users.length})</h2>
      <p>Click on a user to see their posts</p>
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
          onClick={() => handleUserSelect(user)}
        >
          <strong>{user.name}</strong>
          <br />
          <small>{user.email}</small>
        </div>
      ))}
    </div>
  )
}

export default UserList
