import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function AddComment({ postId, onAddComment }) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const submitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to comment.");
      return;
    }

    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post("comments/", {
        post: postId,
        comment: comment
      });

      // Update UI in parent
      onAddComment(response.data);

      // Clear the input
      setComment("");
    } catch (err) {
      console.error("Comment error:", err.response ? err.response.data : err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitComment}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={submitting}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Comment"}
      </button>
    </form>
  );
}

export default AddComment;
