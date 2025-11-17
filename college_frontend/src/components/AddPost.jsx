// import React, { useState } from "react";
// import API from "../services/api";
// import "./AddPost.css";

// function AddPost() {
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     highlight: "",
//     author: 1,
//   });

//   const [imageFile, setImageFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("title", form.title);
//     formData.append("content", form.content);
//     formData.append("highlight", form.highlight);
//     formData.append("author", form.author);

//     if (imageFile) {
//       formData.append("image", imageFile);
//     }

//     try {
//       await API.post("posts/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Post added successfully!");
//       window.location.href = "/";
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add post");
//     }
//   };

//   return (
//     <div className="page-container">
//       <form className="post-form-container" onSubmit={handleSubmit}>
//         <h2>Add New Post</h2>

//         <label>Title</label>
//         <input
//           className="input-box"
//           type="text"
//           placeholder="Enter Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />

//         <label>Highlight</label>
//         <input
//           className="input-box"
//           type="text"
//           placeholder="Short highlight"
//           value={form.highlight}
//           onChange={(e) => setForm({ ...form, highlight: e.target.value })}
//           required
//         />

//         <label>Content</label>
//         <textarea
//           className="textarea-box"
//           placeholder="Write full content here..."
//           value={form.content}
//           onChange={(e) => setForm({ ...form, content: e.target.value })}
//           required
//         ></textarea>

//         <label>Upload Image</label>
//         <input
//           className="file-input"
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageFile(e.target.files[0])}
//         />

//         <button className="submit-button" type="submit">
//           Add Post
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddPost;


import { useState } from "react";
import axios from "axios";

export default function AddPost({ student }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("student_id", student);
    formData.append("content", content);
    if (image) formData.append("image", image);

    await axios.post("http://localhost:5000/add-post", formData);

    alert("Post uploaded!");
  };

  return (
    <div>
      <h2>Add a Post</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write something..."
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <br />

        <button>Upload Post</button>
      </form>
    </div>
  );
}
