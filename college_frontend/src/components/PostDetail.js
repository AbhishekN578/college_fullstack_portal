// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";
// import AddComment from "./AddComment";


// function PostDetail() {
//   const { id } = useParams();
//   const [post, setPost] = useState({});
//   const [comments, setComments] = useState([]);

 

//   useEffect(() => {
//     API.get(`posts/${id}/`).then((res) => setPost(res.data));

//     API.get("comments/").then((res) => {
//       setComments(res.data.filter((c) => c.post === parseInt(id)));
//     });
//   }, [id]);

//   return (
//     <div>
//       <h2>{post.title}</h2>
//       <p>{post.content}</p>

//       <hr />
//       <h3>Comments</h3>

//       {comments.map((c) => (
//         <p key={c.id}>• {c.comment}</p>
//       ))}

//       <AddComment postId={id} />
//     </div>
//   );
// }

// export default PostDetail;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";
// import AddComment from "./AddComment";

// function PostDetail() {
//   const { id } = useParams();
//   const [post, setPost] = useState({});
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     API.get(`posts/${id}/`).then((res) => setPost(res.data));

//     API.get("comments/").then((res) => {
//       setComments(res.data.filter((c) => c.post === parseInt(id)));
//     });
//   }, [id]);

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto" }}>
//       <h2>{post.title}</h2>
//       <p>{post.content}</p>

//       {/* --- SHOW IMAGE --- */}
//       {post.image && (
//         <img
//           src={`http://127.0.0.1:8000${post.image}`}
//           alt="Post"
//           style={{ width: "100%", borderRadius: "10px", marginTop: "20px" }}
//         />
//       )}

//       {/* --- SHOW EXAM FILE --- */}
//       {post.exam_file && (
//         <a
//           href={`http://127.0.0.1:8000${post.exam_file}`}
//           download
//           style={{
//             display: "inline-block",
//             marginTop: "20px",
//             padding: "10px 15px",
//             background: "#007bff",
//             color: "#fff",
//             borderRadius: "6px",
//             textDecoration: "none",
//           }}
//         >
//           📄 Download Exam File
//         </a>
//       )}

//       <hr style={{ marginTop: "30px" }} />

//       <h3>Comments</h3>

//       {comments.map((c) => (
//         <p key={c.id}>• {c.comment}</p>
//       ))}

//       <AddComment postId={id} />
//     </div>
//   );
// }

// export default PostDetail;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../services/api";
// import AddComment from "./AddComment";

// function PostDetail() {
//   const { id } = useParams();
//   const [post, setPost] = useState({});
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     // Fetch post details
//     API.get(`posts/${id}/`)
//       .then((res) => setPost(res.data))
//       .catch((err) => console.error("Post Fetch Error:", err));

//     // Fetch comments
//     API.get("comments/")
//       .then((res) =>
//         setComments(res.data.filter((c) => c.post === parseInt(id)))
//       )
//       .catch((err) => console.error("Comments Fetch Error:", err));
//   }, [id]);

//   return (
//     <div style={{ width: "600px", margin: "20px auto" }}>
//       <h2>{post.title}</h2>
//       <p>{post.content}</p>

//       {/* ⭐ IMAGE PREVIEW */}
//       {post.image && (
//         <img
//           src={`http://localhost:8000${post.image}`}
//           alt="Post"
//           style={{
//             width: "100%",
//             marginTop: "15px",
//             borderRadius: "10px",
//             border: "1px solid #ddd",
//           }}
//         />
//       )}

//       {/* ⭐ FILE PREVIEW */}
//       {post.exam_file && (
//         <div style={{ marginTop: "15px" }}>
//           <h4>Attached File:</h4>
//           <a
//             href={`http://localhost:8000${post.exam_file}`}
//             download
//             style={{
//               padding: "8px 12px",
//               background: "#007bff",
//               color: "white",
//               borderRadius: "5px",
//               textDecoration: "none",
//             }}
//           >
//             Download File
//           </a>
//         </div>
//       )}

//       <hr style={{ margin: "20px 0" }} />

//       {/* ⭐ COMMENTS SECTION */}
//       <h3>Comments</h3>

//       {comments.length === 0 ? (
//         <p>No comments yet.</p>
//       ) : (
//         comments.map((c) => (
//           <p key={c.id}>• {c.comment}</p>
//         ))
//       )}

//       <AddComment postId={id} />
//     </div>
//   );
// }

// export default PostDetail;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import AddComment from "./AddComment";

function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postRes = await API.get(`posts/${id}/`);
        const commentsRes = await API.get("comments/");

        setPost(postRes.data);
        setComments(commentsRes.data.filter((c) => c.post === parseInt(id)));
      } catch (error) {
        console.error("Fetch Error:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (!post) return <h3 style={{ textAlign: "center" }}>Post not found.</h3>;

  return (
    <div
      style={{
        width: "650px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#fafafa",
        border: "1px solid #eee",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* POST TITLE + BODY */}
      <h2 style={{ marginBottom: "10px" }}>{post.title}</h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{post.content}</p>

      {/* IMAGE PREVIEW */}
      {post.image && (
        <img
          src={`http://localhost:8000${post.image}`}
          alt="Post"
          style={{
            width: "100%",
            marginTop: "15px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            objectFit: "cover",
          }}
        />
      )}

      {/* FILE PREVIEW */}
      {post.exam_file && (
        <div style={{ marginTop: "20px" }}>
          <h4>Attached File:</h4>
          <a
            href={`http://localhost:8000${post.exam_file}`}
            download
            style={{
              display: "inline-block",
              padding: "10px 16px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Download File
          </a>
        </div>
      )}

      <hr style={{ margin: "25px 0" }} />

      {/* COMMENTS */}
      <h3>Comments</h3>

      {comments.length === 0 ? (
        <p style={{ color: "gray" }}>No comments yet.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {comments.map((c) => (
            <li key={c.id} style={{ marginBottom: "6px" }}>
              {c.comment}
            </li>
          ))}
        </ul>
      )}

      {/* ADD COMMENT FORM */}
      <div style={{ marginTop: "20px" }}>
        <AddComment postId={id} />
      </div>
    </div>
  );
}

export default PostDetail;
