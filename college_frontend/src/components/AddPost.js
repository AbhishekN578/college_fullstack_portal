import React, { useState } from "react";
import API from "../services/api";
import "./AddPost.css";
function AddPost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    highlight: "",
    author: 1,  // TEMP static user
  });


 

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // form-data because image is included
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("highlight", form.highlight);
    formData.append("author", form.author);
// if (examFile) {
//   formData.append("exam_file", examFile);
// }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await API.post("posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post added successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    }
  };

  return (
    <div className="page-container">    
    <form className="post-form-container" onSubmit={handleSubmit}>
      <h2>Add New Post</h2>

      {/* Title */}
      <label>Title</label>
      <input
        className="input-box"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      {/* Highlight */}
      <label>Highlight</label>
      <input
        className="input-box"
        type="text"
        placeholder="Highlight (short important line)"
        value={form.highlight}
        onChange={(e) => setForm({ ...form, highlight: e.target.value })}
        required
      />

      {/* Content */}
      <label>Content</label>
      <textarea
        className="textarea-box"
        placeholder="Content"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
      ></textarea>
      

      {/* Image Upload */}
      <label>Upload Image</label>
      <input
        className="file-input"
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      {/* <label>Upload file</label>
      <input 
      className="file-input"
      type="file" 
       onChange={(e) => setExamFile(e.target.files[0])} 
     /> */}



      <button className="submit-button" type="submit">Add Post</button>
    </form>
    </div>
  );
}

export default AddPost;
