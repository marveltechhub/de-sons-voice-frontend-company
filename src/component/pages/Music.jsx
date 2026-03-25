import React from 'react'
import './Music.css'

const Music = () => {
  return (
    <div className="music-section">
      <div className="music-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title-group">
            <h2 className="section-title">Sermons & Praise</h2>
            <p className="section-subtitle">Blessed songs, chants from your favourite artists</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          <div className="category-card worship">
            <div className="category-icon">🙏</div>
            <h3>Worship</h3>
            <p>Deep spiritual worship songs</p>
          </div>
          <div className="category-card gospel">
            <div className="category-icon">🎵</div>
            <h3>Gospel</h3>
            <p>Uplifting gospel music</p>
          </div>
          <div className="category-card praise">
            <div className="category-icon">✨</div>
            <h3>Praise</h3>
            <p>High-energy praise songs</p>
          </div>
          <div className="category-card chant">
            <div className="category-icon">🔔</div>
            <h3>Chants</h3>
            <p>Sacred chants & meditations</p>
          </div>
        </div>

        {/* Scripture Quote */}
        <div className="scripture-quote">
          <div className="quote-icon">"</div>
          <p>Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord.</p>
          <span className="quote-ref">- Colossians 3:16</span>
        </div>

        {/* Bottom Brand */}
        <div className="music-brand">
          <div className="brand-logo">
            <img src="../../../public/logo.jpeg" alt="logo" />
            <div className="brand-text">
              <span>DE SONS</span>
              <span>VOICE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Music
