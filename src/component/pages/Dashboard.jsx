import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import CreatePost from "./CreatePost";
import { Play, Pause, Trash2, Music } from "lucide-react";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/posts/me")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  const deletePost = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const togglePlay = (postId) => {
    if (currentPlaying === postId) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(postId);
    }
  };

  const downloadPost = (post, e) => {
    e?.stopPropagation();
    const musicTitle = post.text || "music";
    const musicianName = post.musicianName || post.user?.fullName || "artist";
    const filename = `${musicianName} - ${musicTitle}.mp3`;
    
    const link = document.createElement('a');
    link.href = post.music;
    link.download = filename;
    link.click();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg">
        <div className="dashboard-gradient"></div>
      </div>

      <div className="dashboard-container">
        <CreatePost onPost={(post) => setPosts([post, ...posts])} />

        <div className="posts-section">
          <h2 className="section-title">Your Uploads</h2>
          
          {posts.length === 0 ? (
            <div className="empty-posts">
              <Music size={48} />
              <h3>No music uploaded yet</h3>
              <p>Upload your first music using the form above</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="post-card-modern">
                  {/* Image */}
                  {post.image && (
                    <div className="post-image-container">
                      <img 
                        src={post.image} 
                        alt={post.text} 
                        className="post-image-modern" 
                      />
                      <div className="post-image-overlay">
                        <button 
                          className="play-overlay-btn"
                          onClick={() => togglePlay(post._id)}
                        >
                          {currentPlaying === post._id ? (
                            <Pause size={24} />
                          ) : (
                            <Play size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="post-content">
                    {/* Musician Name - Primary */}
                    <div className="musician-name">
                      {post.musicianName || post.user?.fullName || "Unknown Artist"}
                    </div>
                    
                    {/* Music Title */}
                    <h4 className="post-title">{post.text || "Untitled"}</h4>

                    {/* Audio Player */}
                    {post.music && (
                      <div className="post-audio-container">
                        <audio
                          controls
                          src={post.music}
                          onPlay={() => setCurrentPlaying(post._id)}
                          onPause={() => setCurrentPlaying(null)}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="post-actions">
                      <a 
                        href={post.music} 
                        download 
                        className="download-btn-modern"
                        onClick={(e) => downloadPost(post, e)}
                      >
                        Download
                      </a>
                      <button 
                        className="delete-btn-modern"
                        onClick={() => deletePost(post._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
