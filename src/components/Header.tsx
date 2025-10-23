import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          Chuzapath
        </Link>

        <button
          className="hamburger"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        {isOpen && (
          <nav className="nav-menu" onMouseLeave={closeMenu}>
            <Link to="/" onClick={closeMenu}>Game</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header


