import { useState } from "react";
import API from "../../api/api";
import "./Dashboard.css";

const CreatePost = ({ onPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);
    if (music) formData.append("music", music);

    try {
      const res = await API.post("/posts", formData);
      onPost(res.data);
      setText("");
      setImage(null);
      setMusic(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="create-post">
      <textarea
        placeholder="Music Title Only"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="preview-image"
        />
      )}


      <div className="file-row">
        <label>
          📷 Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <label>
          🎵 Music
          <input
            type="file"
            accept="audio/*"
            hidden
            onChange={(e) => setMusic(e.target.files[0])}
          />
        </label>

        <button disabled={loading}>
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
