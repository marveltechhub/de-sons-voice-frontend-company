import { useEffect, useState } from "react";
import API from "../../api/api";
import "./Grow.css";
import { Search, Play, Download, Heart, Clock, Filter, Grid, List } from "lucide-react";

const Grow = () => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    API.get("/posts")
      .then((res) => {
        const musicPosts = res.data.filter((p) => p.music);
        setSongs(musicPosts);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔍 SEARCH FILTER
  const filteredSongs = songs.filter((post) => {
    const q = query.toLowerCase();
    const matchesSearch = 
      post.text?.toLowerCase().includes(q) ||
      post.user?.fullName?.toLowerCase().includes(q);
    
    if (filter === "all") return matchesSearch;
    // Add more filters as needed
    return matchesSearch;
  });

  return (
    <div className="discover-page">
      <div className="discover-bg">
        <div className="discover-gradient"></div>
        <div className="discover-pattern"></div>
      </div>

      <div className="discover-content">
        {/* Header */}
        <div className="discover-header">
          <div className="header-text">
            <h1>Discover</h1>
            <p>Explore our collection of Christian music</p>
          </div>
          
          {/* Filters & View Toggle */}
          <div className="header-controls">
            <div className="filter-group">
              <Filter size={16} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Songs</option>
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button 
                className={viewMode === "grid" ? "active" : ""} 
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </button>
              <button 
                className={viewMode === "list" ? "active" : ""} 
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="discover-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="song-count">{filteredSongs.length} songs</span>
        </div>

        {/* Songs Grid/List */}
        <div className={`songs-${viewMode}`}>
          {filteredSongs.length === 0 && (
            <div className="empty-state">
              <span>🎵</span>
              <h3>No songs found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

          {filteredSongs.map((post, index) => (
            <div 
              key={post._id} 
              className="song-card"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {/* Image */}
              <div className="song-image-container">
                <img
                  src={post.image || "/music.jpg"}
                  alt="cover"
                  className="song-image"
                />
                <div className="song-overlay">
                  <button className="play-btn">
                    <Play size={24} />
                  </button>
                </div>
                <div className="song-duration">
                  <Clock size={12} />
                  <span>3:45</span>
                </div>
              </div>

              {/* Body */}
              <div className="song-body">
                <div className="song-info">
                  <h3 className="song-title">{post.user?.fullName || "Unknown Artist"}</h3>
                  <p className="song-desc">{post.text || "Christian Music"}</p>
                </div>

                <div className="song-actions">
                  <button className="action-btn like-btn">
                    <Heart size={18} />
                  </button>
                  <a
                    href={post.music}
                    download
                    className="action-btn download-btn"
                  >
                    <Download size={18} />
                  </a>
                  <audio controls src={post.music} className="song-audio" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grow;
