import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./PostList.css";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log("Posts state updated:", posts);
    console.log("Posts length:", posts.length);
  }, [posts]);

  const fetchPosts = () => {
    console.log("Fetching posts...");
    API.get("posts/")
      .then((res) => {
        console.log("Posts received:", res.data);
        console.log("Number of posts:", res.data.length);
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        console.error("Error details:", err.response);
      });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please login to like posts");
      navigate("/login");
      return;
    }

    try {
      setLoadingLike(postId);

      const res = await API.post(`posts/${postId}/like/`);

      // Update the post with new like data
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              liked_by_user: res.data.liked_by_user,
              likes_count: res.data.likes_count,
            }
            : post
        )
      );
    } catch (err) {
      console.error("LIKE ERROR:", err.response ? err.response.data : err);
      alert("Could not like the post. Please make sure you are logged in.");
    } finally {
      setLoadingLike(null);
    }
  };

  const handleComment = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="portal-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h3>College News</h3>
        <ul>
          {!user ? (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/add-post">Add Post</Link></li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1 className="portal-title">College Commentary Portal</h1>

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '18px', color: '#7f8c8d' }}>
                No posts available. {user ? 'Be the first to create one!' : 'Please login to see posts.'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content?.slice(0, 100) || ""}...</p>

                <div className="post-actions">
                  <button
                    className={`action-btn like-btn ${post.liked_by_user ? "liked" : ""
                      }`}
                    onClick={() => handleLike(post.id)}
                    disabled={loadingLike === post.id}
                  >
                    👍 {post.likes_count || 0}
                  </button>

                  <button
                    className="action-btn comment-btn"
                    onClick={() => handleComment(post.id)}
                  >
                    💬 {post.comments_count || 0}
                  </button>
                </div>

                <Link to={`/post/${post.id}`} className="read-more-link">
                  Read More
                </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default PostList;
