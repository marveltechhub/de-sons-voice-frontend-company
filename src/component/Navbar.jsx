import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { Menu, X, Music, Headphones } from 'lucide-react'
import img from './../../public/logo.jpeg'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
    <div className="navbar-container">
      <div className="navbar">
        <div className="nav-prop">
          {/* Brand */}
          <Link to="/" className="brand">
            <div className="logo-container">
              <img src={img} alt="logo" />
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-de">DE SONS</span>
              <span className="brand-voice">VOICE</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="nav-right">
            <Link to="/" className="nav-link">
              <Music size={18} />
              <span>Home</span>
            </Link>
            <Link to="/discover" className="nav-link">
              <Headphones size={18} />
              <span>Discover</span>
            </Link>
            <Link to="/login" className="nav-link login-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link signup-link">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <Menu className="menu-icon" onClick={() => setOpen(true)} />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`drawer ${open ? 'open' : ''}`}>
        <X className="close-icon" onClick={() => setOpen(false)} />

        <Link to="/" onClick={() => setOpen(false)} className="mobile-link">
          <Music size={20} />
          <span>Home</span>
        </Link>
        <Link to="/discover" onClick={() => setOpen(false)} className="mobile-link">
          <Headphones size={20} />
          <span>Discover</span>
        </Link>
        <Link to="/login" onClick={() => setOpen(false)} className="mobile-link">
          Login
        </Link>
        <Link to="/signup" onClick={() => setOpen(false)} className="mobile-link">
          Sign Up
        </Link>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
        </div>
    </>
  )
}

export default Navbar
