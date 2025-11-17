import React, { useState } from "react";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("login/", { username, password });

      // Save user login info
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("username", res.data.username);

      alert("Login successful!");

      window.location.href = "/"; // Redirect to home
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div style={{ width: "300px", margin: "100px auto" }}>
      <h2>Student Login</h2>

      <form onSubmit={loginUser}>
        <input
          type="text"
          placeholder="Student Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
