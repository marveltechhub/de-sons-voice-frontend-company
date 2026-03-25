import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/api";
import "./Grow.css";
import { Search, Play, Download, ArrowLeft, User, Music } from "lucide-react";

const MusicianProfile = () => {
  const { musicianName } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  useEffect(() => {
    setLoading(true);
    API.get("/posts")
      .then((res) => {
        const allMusicPosts = res.data.filter((p) => p.music);
        const musicianSongs = allMusicPosts.filter(
          (post) => 
            (post.musicianName || post.user?.fullName) === decodeURIComponent(musicianName)
        );
        setSongs(musicianSongs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [musicianName]);

  const togglePlay = (postId) => {
    if (currentPlaying === postId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(postId);
    }
  };

  return (
    <div className="discover-page">
      <div className="discover-bg">
        <div className="discover-gradient"></div>
        <div className="discover-pattern"></div>
      </div>

      <div className="discover-content">
        {/* Back Button */}
        <Link to="/discover" className="back-btn">
          <ArrowLeft size={20} />
          <span>Back to Discover</span>
        </Link>

        {/* Musician Header */}
        <div className="musician-profile-header">
          <div className="musician-avatar-large">
            <User size={48} />
          </div>
          <h1>{decodeURIComponent(musicianName)}</h1>
          <p>{songs.length} songs</p>
        </div>

        {/* Songs */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-state">
            <Music size={48} />
            <h3>No songs yet</h3>
            <p>This musician hasn't uploaded any songs</p>
          </div>
        ) : (
          <div className="songs-grid">
            {songs.map((post, index) => (
              <div 
                key={post._id} 
                className="song-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Image */}
                <div className="song-image-container">
                  <img
                    src={post.image || "/music.jpg"}
                    alt="cover"
                    className="song-image"
                  />
                  <div className="song-overlay">
                    <button 
                      className="play-btn"
                      onClick={() => togglePlay(post._id)}
                    >
                      {currentPlaying === post._id ? (
                        <span className="pause-icon">⏸</span>
                      ) : (
                        <Play size={24} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="song-body">
                  <h3 className="song-title">{post.text || "Untitled Audio"}</h3>

                  <div className="song-actions">
                    <audio
                      controls
                      src={post.music}
                      onPlay={() => setCurrentPlaying(post._id)}
                      onPause={() => setCurrentPlaying(null)}
                    />
                    <a href={post.music} download className="download-btn-modern">
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicianProfile;
