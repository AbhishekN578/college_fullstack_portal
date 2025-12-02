import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";

export default function Profile() {
  const { user, logout, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load User Data
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadUser() {
      try {
        const res = await API.get(`users/${user.id}/`);
        setForm({
          username: res.data.username || "",
          email: res.data.email || "",
          first_name: res.data.first_name || "",
        });
      } catch (err) {
        console.log("Error loading user:", err);
      }
      setLoading(false);
    }

    loadUser();
  }, [user, navigate]);

  // 🔹 Update Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await API.put(`users/${user.id}/`, form);

      // update user data in context
      login(res.data);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }

    setSaving(false);
  };

  // 🔹 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <h2>Loading profile...</h2>;

  return (
    <div className="portal-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>College News</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>Your Profile</h1>

        <form className="profile-form" onSubmit={handleUpdate}>

          <label>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <label>Full Name</label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </button>

        </form>
      </main>
    </div>
  );
}
