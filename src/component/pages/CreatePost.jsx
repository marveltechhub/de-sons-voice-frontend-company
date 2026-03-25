import { useState } from "react";
import API from "../../api/api";
import "./Dashboard.css";
import { Music, Image, Upload, Link as LinkIcon } from "lucide-react";

const CreatePost = ({ onPost }) => {
  const [text, setText] = useState("");
  const [musicianName, setMusicianName] = useState("");
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    formData.append("musicianName", musicianName);
    if (image) formData.append("image", image);
    if (music) formData.append("music", music);
    if (youtubeUrl) formData.append("youtubeUrl", youtubeUrl);

    try {
      const res = await API.post("/posts", formData);
      onPost(res.data);
      setText("");
      setMusicianName("");
      setImage(null);
      setMusic(null);
      setYoutubeUrl("");
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMusicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMusic(file);
    }
  };

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYoutubeId(youtubeUrl);

  return (
    <form onSubmit={submit} className="create-post-modern">
      <div className="create-post-header">
        <h3>Upload New Music</h3>
        <p>Share your music with the community</p>
      </div>

      {/* Musician Name - NEW FIELD */}
      <div className="input-group-modern">
        <label>Musician Name</label>
        <input
          type="text"
          placeholder="Enter musician/artist name"
          value={musicianName}
          onChange={(e) => setMusicianName(e.target.value)}
          required
        />
      </div>

      {/* Music Title */}
      <div className="input-group-modern">
        <label>Music Title</label>
        <textarea
          placeholder="Enter music title..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          required
        />
      </div>

      {/* YouTube URL */}
      <div className="input-group-modern">
        <label>YouTube URL (optional)</label>
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        {youtubeId && (
          <div className="youtube-preview">
            <img 
              src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} 
              alt="YouTube preview" 
            />
            <span>YouTube video detected</span>
          </div>
        )}
      </div>

      {/* Preview Image */}
      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="preview" className="preview-image-modern" />
          <button 
            type="button" 
            className="remove-preview"
            onClick={() => { setImage(null); setPreviewUrl(null); }}
          >
            ×
          </button>
        </div>
      )}

      {/* File Upload Buttons */}
      <div className="file-row-modern">
        <label className="file-btn">
          <Image size={18} />
          <span>Add Image</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </label>

        <label className="file-btn music-btn">
          <Music size={18} />
          <span>{music ? music.name : "Add Music"}</span>
          <input
            type="file"
            accept="audio/*"
            hidden
            onChange={handleMusicChange}
          />
        </label>

        <label className="file-btn youtube-btn">
          <LinkIcon size={18} />
          <span>YouTube Link</span>
          <input
            type="url"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="youtube-input-hidden"
          />
        </label>

        <button type="submit" className="submit-btn-modern" disabled={loading}>
          <Upload size={18} />
          {loading ? "Posting…" : "Post Music"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
