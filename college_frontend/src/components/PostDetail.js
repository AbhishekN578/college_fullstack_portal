import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AddComment from "./AddComment";
import "./PostDetail.css";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const postRes = await API.get(`posts/${id}/`);
        const commentsRes = await API.get("comments/");

        setPost(postRes.data);
        setComments(commentsRes.data.filter((c) => c.post === parseInt(id)));
        setLikes(postRes.data.likes || 0);
        setLikedByUser(postRes.data.liked_by_user || false);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const handleLikeToggle = async () => {
    try {
      if (!likedByUser) {
        await API.post(`posts/${id}/like/`);
        setLikes(likes + 1);
      } else {
        await API.post(`posts/${id}/unlike/`);
        setLikes(likes - 1);
      }
      setLikedByUser(!likedByUser);
    } catch (error) {
      console.error("Like Toggle Error:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`posts/${id}/`);
      alert("Post deleted successfully.");
      navigate("/"); // redirect to homepage or posts list
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete post.");
    }
  };

  if (loading) return <h3 className="center-text">Loading...</h3>;
  if (!post) return <h3 className="center-text">Post not found.</h3>;

  return (
    <div className="post-detail-container">
      {/* Headlines */}
      <div className="main-headline">College Commentary Portal</div>
      <div className="sub-headline">College News</div>

      {/* Post Title */}
      <h2>{post.title}</h2>

      {/* Post Content */}
      <p>{post.content}</p>

      {/* Image Preview */}
      {post.image && <img src={`http://localhost:8000${post.image}`} alt="Post" />}

      {/* File Preview */}
      {post.exam_file && (
        <div className="file-download">
          <h4>Attached File:</h4>
          <a href={`http://localhost:8000${post.exam_file}`} download>
            Download File
          </a>
        </div>
      )}

      {/* Like, Comment & Delete Buttons */}
      <div className="buttons">
        <button className="like-btn" onClick={handleLikeToggle}>
          {likedByUser ? "Unlike" : "Like"} ({likes})
        </button>
        <button
          className="comment-btn"
          onClick={() =>
            document.querySelector(".add-comment").scrollIntoView({ behavior: "smooth" })
          }
        >
          Comment
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete Post
        </button>
      </div>

      <hr />

      {/* Comments */}
      <h3>Comments</h3>
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet.</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>{c.comment}</li>
          ))}
        </ul>
      )}

      {/* Add Comment Form */}
      <div className="add-comment">
        <AddComment postId={id} />
      </div>
    </div>
  );
}

export default PostDetail;
