import React from 'react'
import UserList from './components/UserList'
import PostList from './components/PostList'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CYOA Game - React + TypeScript + Axios + Zustand</h1>
        <p>A simple app demonstrating React with TypeScript, Axios for API calls, and Zustand for state management.</p>
      </header>
      
      <main className="App-main">
        <div className="App-content">
          <UserList />
          <PostList />
        </div>
      </main>
    </div>
  )
}

export default App
