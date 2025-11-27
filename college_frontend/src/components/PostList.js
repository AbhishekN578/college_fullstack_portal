import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "./PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="portal-container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h3>College News</h3>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="portal-title">College Commentary Portal</h1>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content.substring(0, 100)}...</p>
              <div className="post-info">
                <span>👍 {post.likes || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
              <Link to={`/post/${post.id}`} className="read-more-link">Read More</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PostList;
