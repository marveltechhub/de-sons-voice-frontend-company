import React, { useEffect, useState } from "react";
import "./Home.css";
import { Search, Play, Heart, Clock, TrendingUp, Sparkles } from "lucide-react";
import Grow from "./Grow";
import API from "../../api/api";
import Music from "./Music";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
        // Set a random featured song
        const musicPosts = res.data.filter((p) => p.music);
        if (musicPosts.length > 0) {
          const randomIndex = Math.floor(Math.random() * musicPosts.length);
          setFeatured(musicPosts[randomIndex]);
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, []);

  // 🎵 only music posts
  const musicPosts = posts.filter((p) => p.music);

  // 🔍 live search
  const searchResults = musicPosts.filter((post) => {
    const q = query.toLowerCase();
    return (
      post.text?.toLowerCase().includes(q) ||
      post.user?.fullName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
          <div className="floating-notes">
            <span>♪</span><span>♫</span><span>♬</span><span>♩</span><span>♭</span>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Christian Music Streaming</span>
          </div>
          
          <h1 className="hero-title">
            Experience <span className="gradient-text">Spiritual Music</span> Like Never Before
          </h1>
          
          <p className="hero-subtitle">
            Stream and download over <b>1,500+</b> songs, chants, and sermons 
            from your favorite artists and preachers.
          </p>

          {/* Modern Search */}
          <div className="search-container">
            <div className="search-box-modern">
              <Search className="search-icon-modern" />
              <input
                placeholder="Search songs, artists, sermons..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="search-btn-modern">
                <Play size={18} />
              </button>
            </div>
            
            {/* Search Suggestions */}
            <div className="search-suggestions">
              <span>Popular:</span>
              <button onClick={() => setQuery("worship")}>Worship</button>
              <button onClick={() => setQuery("gospel")}>Gospel</button>
              <button onClick={() => setQuery("praise")}>Praise</button>
              <button onClick={() => setQuery("chant")}>Chants</button>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <TrendingUp size={20} />
              <div>
                <span className="stat-value">1,500+</span>
                <span className="stat-label">Songs</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <Heart size={20} />
              <div>
                <span className="stat-value">50K+</span>
                <span className="stat-label">Listeners</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <Clock size={20} />
              <div>
                <span className="stat-value">24/7</span>
                <span className="stat-label">Streaming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Card */}
        {featured && !query && (
          <div className="featured-card">
            <div className="featured-badge">
              <span>★ Featured</span>
            </div>
            <img
              src={featured.image || "/music.jpg"}
              alt="featured"
              className="featured-image"
            />
            <div className="featured-info">
              <h3>{featured.user?.fullName}</h3>
              <p>{featured.text}</p>
              <audio controls src={featured.music} className="featured-audio" />
            </div>
          </div>
        )}
      </div>

      {/* Search Results Overlay */}
      {query && (
        <div className="search-overlay">
          <div className="search-results-modern">
            <div className="search-results-header">
              <h3>Search Results</h3>
              <span>{searchResults.length} songs found</span>
            </div>
            
            {searchResults.length === 0 && (
              <div className="no-results">
                <span>🔍</span>
                <p>No results found for "{query}"</p>
              </div>
            )}

            <div className="results-grid">
              {searchResults.map((post, index) => (
                <div 
                  key={post._id} 
                  className="result-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={post.image || "/music.jpg"}
                    alt="cover"
                    className="result-image"
                  />
                  <div className="result-info">
                    <h4>{post.text || "Untitled Audio"}</h4>
                    <span className="result-artist">{post.user?.fullName}</span>
                    <audio controls src={post.music} className="result-audio" />
                  </div>
                  <a href={post.music} download className="download-btn-modern">
                    ↓
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Music />
    </div>
  );
};

export default HomePage;
