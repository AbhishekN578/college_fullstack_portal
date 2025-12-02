import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import AddComment from "./AddComment";
import { AuthContext } from "../context/AuthContext";
import "./PostDetail.css";

function PostDetail() {
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Post + Comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await API.get(`posts/${id}/`);

        setPost(res.data);
        setLikes(res.data.likes_count);
        setLikedByUser(res.data.liked_by_user);

        const commentRes = await API.get("comments/");
        setComments(commentRes.data.filter((c) => c.post === Number(id)));
      } catch (err) {
        console.error("Error loading post:", err);
      }
      setLoading(false);
    };

    fetchPostData();
  }, [id]);

  // Like Toggle
  const handleLike = async () => {
    if (!user) {
      alert("Please login to like posts.");
      return;
    }

    try {
      const res = await API.post(`posts/${id}/like/`);
      setLikes(res.data.likes_count);
      setLikedByUser(res.data.liked_by_user);
    } catch (err) {
      console.error("Like error:", err);
      alert("Could not like the post. Please try again.");
    }
  };

  // Delete Post
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await API.delete(`posts/${id}/`);
      alert("Post deleted.");
      navigate("/");
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle new comment added
  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (loading) return <h2>Loading...</h2>;
  if (!post) return <h2>Post not found</h2>;

  return (
    <div className="portal-container">
      {/* Sidebar */}
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
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>{post.title}</h1>
        <p>{post.content}</p>

        {post.image && (
          <img
            src={`http://localhost:8000${post.image}`}
            alt="Post"
            className="post-image"
          />
        )}

        {/* Download File */}
        {post.exam_file && (
          <div className="file-download">
            <h4>Download File</h4>
            <a href={`http://localhost:8000${post.exam_file}`} download>
              Click here
            </a>
          </div>
        )}

        {/* Buttons */}
        <div className="buttons">
          <button className="like-btn" onClick={handleLike}>
            {likedByUser ? "Unlike" : "Like"} ({likes})
          </button>

          <button
            className="comment-btn"
            onClick={() =>
              document
                .querySelector(".add-comment")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Comment ({comments.length})
          </button>

          <button className="delete-btn" onClick={handleDelete}>
            Delete Post
          </button>
        </div>

        {/* Comments */}
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c.id}>
                <strong>{c.user.username}:</strong> {c.comment}
              </li>
            ))}
          </ul>
        )}

        {/* Add Comment */}
        <div className="add-comment">
          <AddComment postId={id} onAddComment={handleCommentAdded} />
        </div>
      </main>
    </div>
  );
}

export default PostDetail;
