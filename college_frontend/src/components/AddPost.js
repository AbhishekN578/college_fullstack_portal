import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./AddPost.css";

function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", highlight: "" });
  const [imageFile, setImageFile] = useState(null);

  if (!user) {
    return (
      <div className="page-container">
        <div className="login-message">
          <h2>Please login to add a post.</h2>
          <p>
            <Link to="/login">Login</Link> or <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("highlight", form.highlight);
    formData.append("content", form.content);
    formData.append("author", user.id);

    if (imageFile) formData.append("image", imageFile);

    try {
      await API.post("posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    }
  };

  return (
    <div className="page-container">
      <form className="post-form-container" onSubmit={handleSubmit}>
        <h2>Add New Post</h2>

        <label>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <label>Highlight</label>
        <input
          type="text"
          value={form.highlight}
          onChange={(e) => setForm({ ...form, highlight: e.target.value })}
          required
        />

        <label>Content</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}

export default AddPost;
