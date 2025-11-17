import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>College News</h2>
      <Link to="/add-post">➕ Add Post</Link>

      {posts.map((post) => (
        <div key={post.id} style={{ margin: "20px", padding: "10px", border: "1px solid gray" }}>
          <h3>{post.title}</h3>
          <p>{post.content.substring(0, 100)}...</p>
          <Link to={`/post/${post.id}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
}

export default PostList;
