import { useEffect, useState, useRef } from "react";
import API from "../../api/api";
import "./Grow.css";
import { Link } from "react-router-dom";
import { Search, Download, Filter, Grid, List, User, Music, X, Minimize2, SkipBack, SkipForward, ChevronDown } from "lucide-react";

const Grow = () => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const audioRef = useRef(null);

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
      post.musicianName?.toLowerCase().includes(q) ||
      post.user?.fullName?.toLowerCase().includes(q);
    
    if (filter === "all") return matchesSearch;
    return matchesSearch;
  });

  // Group songs by musician
  const musicians = [...new Set(filteredSongs.map(post => post.musicianName || post.user?.fullName || "Unknown"))];

  // Extract YouTube ID
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Toggle play/pause
  const togglePlay = (postId) => {
    if (currentPlaying === postId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(postId);
      setModalOpen(true);
      setMinimized(false);
    }
  };

  // Open modal for a specific song
  const openModal = (postId) => {
    setCurrentPlaying(postId);
    setModalOpen(true);
    setMinimized(false);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Minimize modal
  const minimizeModal = () => {
    setMinimized(true);
  };

  // Restore modal from minimized
  const restoreModal = () => {
    setMinimized(false);
  };

  // Handle download with proper filename
  const handleDownload = (post, e) => {
    e?.stopPropagation();
    const musicTitle = post.text || "music";
    const musicianName = post.musicianName || post.user?.fullName || "artist";
    const filename = `${musicianName} - ${musicTitle}.mp3`;
    
    const link = document.createElement('a');
    link.href = post.music;
    link.download = filename;
    link.click();
  };

  // Get current playing post
  const currentPost = currentPlaying ? songs.find(s => s._id === currentPlaying) : null;

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
            placeholder="Search songs, musicians..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="song-count">{filteredSongs.length} songs</span>
        </div>

        {/* Musicians Section */}
        {musicians.length > 0 && !query && (
          <div className="musicians-section">
            <h2 className="musicians-title">Featured Musicians</h2>
            <div className="musicians-scroll">
              {musicians.map((musician, index) => (
                <Link 
                  to={`/musician/${encodeURIComponent(musician)}`} 
                  key={index}
                  className="musician-chip"
                >
                  <User size={16} />
                  <span>{musician}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Songs Grid/List */}
        <div className={`songs-${viewMode}`}>
          {filteredSongs.length === 0 && (
            <div className="empty-state">
              <span>🎵</span>
              <h3>No songs found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}

          {filteredSongs.map((post, index) => {
            const youtubeId = getYoutubeId(post.youtubeUrl);
            const isPlaying = currentPlaying === post._id;
            
            return (
              <div 
                key={post._id} 
                className={`song-card ${isPlaying ? 'playing' : ''}`}
                style={{ animationDelay: `${index * 0.03}s` }}
                onClick={() => openModal(post._id)}
              >
                {/* Image */}
                <div className="song-image-container">
                  {youtubeId ? (
                    <a 
                      href={post.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="youtube-thumbnail"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                        alt="YouTube"
                        className="song-image"
                      />
                      <div className="youtube-play-icon">▶</div>
                    </a>
                  ) : post.image ? (
                    <img
                      src={post.image}
                      alt="cover"
                      className="song-image"
                    />
                  ) : (
                    <div className="default-music-image">
                      <Music size={48} />
                    </div>
                  )}
                  

                  {/* Transparent Audio Player - Always Visible */}
                  <div className="card-audio-transparent" onClick={(e) => e.stopPropagation()}>
                    <audio
                      ref={audioRef}
                      controls
                      src={post.music}
                      className="transparent-audio"
                      onPlay={() => setCurrentPlaying(post._id)}
                      onPause={() => setCurrentPlaying(null)}
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="song-body">
                  {/* Musician Name with Border - PROMINENT */}
                  <Link 
                    to={`/musician/${encodeURIComponent(post.musicianName || post.user?.fullName || "Unknown")}`}
                    className="musician-name-border"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <User size={14} />
                    <span>{post.musicianName || post.user?.fullName || "Unknown Artist"}</span>
                  </Link>
                  
                  {/* Music Title */}
                  <h3 className="song-title">{post.text || "Untitled Audio"}</h3>

                  {/* Compact Download */}
                  <div className="song-actions-compact">
                    <button 
                      className="download-btn-compact"
                      onClick={(e) => handleDownload(post, e)}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Music Player Modal */}
      {modalOpen && currentPost && (
        <div className={`music-modal ${minimized ? 'minimized' : ''}`}>
          {!minimized ? (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Close & Minimize Buttons */}
              <div className="modal-header">
                <button className="modal-minimize-btn" onClick={minimizeModal}>
                  <Minimize2 size={18} />
                </button>
                <button className="modal-close-btn" onClick={closeModal}>
                  <X size={20} />
                </button>
              </div>

              {/* Modal Image */}
              <div className="modal-image">
                {youtubeId = getYoutubeId(currentPost.youtubeUrl) ? (
                  <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="" />
                ) : currentPost.image ? (
                  <img src={currentPost.image} alt="" />
                ) : (
                  <div className="modal-default-icon"><Music size={80} /></div>
                )}
              </div>

              {/* Modal Info */}
              <div className="modal-info">
                <h2>{currentPost.text || "Untitled"}</h2>
                <p>{currentPost.musicianName || currentPost.user?.fullName || "Unknown Artist"}</p>
              </div>

              {/* Modal Controls */}
              <div className="modal-controls">
                <button className="modal-control-btn">
                  <SkipBack size={24} />
                </button>
                <button 
                  className="modal-control-btn play"
                  onClick={() => {
                    const audio = document.querySelector('.modal-audio-element');
                    if (audio) {
                      if (audio.paused) audio.play();
                      else audio.pause();
                    }
                  }}
                >
                  <Play size={32} />
                </button>
                <button className="modal-control-btn">
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Modal Audio */}
              <audio
                className="modal-audio-element"
                controls
                src={currentPost.music}
                autoPlay
              />

              {/* Modal Download */}
              <button 
                className="modal-download-btn"
                onClick={(e) => handleDownload(currentPost, e)}
              >
                <Download size={20} />
                Download MP3
              </button>
            </div>
          ) : (
            /* Minimized Player */
            <div className="minimized-player" onClick={restoreModal}>
              <div className="minimized-info">
                <div className="minimized-image">
                  {currentPost.image ? (
                    <img src={currentPost.image} alt="" />
                  ) : (
                    <Music size={20} />
                  )}
                </div>
                <div className="minimized-text">
                  <span className="minimized-title">{currentPost.text}</span>
                  <span className="minimized-artist">{currentPost.musicianName || currentPost.user?.fullName}</span>
                </div>
              </div>
              <div className="minimized-controls" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="minimized-play-btn"
                  onClick={() => {
                    const audio = document.querySelector('.modal-audio-element');
                    if (audio) {
                      if (audio.paused) audio.play();
                      else audio.pause();
                    }
                  }}
                >
                  <Play size={20} />
                </button>
                <button className="minimized-close-btn" onClick={(e) => { e.stopPropagation(); closeModal(); }}>
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Audio Player (for minimized state) */}
      {modalOpen && minimized && (
        <div className="global-audio-container">
          <audio
            className="modal-audio-element"
            controls
            src={currentPost?.music}
          />
        </div>
      )}
    </div>
  );
};

export default Grow;
