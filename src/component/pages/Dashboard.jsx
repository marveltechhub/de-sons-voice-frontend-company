import { useEffect, useState } from "react";
import API from "../../api/api";
import CreatePost from "./CreatePost";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts/me").then((res) => setPosts(res.data));
  }, []);

  const deletePost = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  return (
    <div className="dashboard">
      <CreatePost onPost={(post) => setPosts([post, ...posts])} />

      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <h4>{post.user?.fullName || "You"}</h4>

          {post.text && <p>{post.text}</p>}

          {post.image && (
            <img src={post.image} className="post-image" />
          )}

          {post.music && (
            <>
              <audio controls src={post.music} />
              <a href={post.music} download>Download</a>
            </>
          )}

          {/* 🗑 DELETE */}
          <button
            className="delete-btn"
            onClick={() => deletePost(post._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
