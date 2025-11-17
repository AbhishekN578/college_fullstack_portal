import React, { useState } from "react";
import API from "../services/api";

function AddComment({ postId }) {
  const [comment, setComment] = useState("");

  const submitComment = (e) => {
    e.preventDefault();

    API.post("comments/", {
      post: postId,
      user: 1,     // TEMP: fixed user ID until login system added
      comment: comment
    }).then(() => {
      alert("Comment added!");
      setComment("");
      window.location.reload();
    });
  };

  return (
    <form onSubmit={submitComment}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit">Add Comment</button>
    </form>
  );
}

export default AddComment;
