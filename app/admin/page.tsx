"use client";

import LeadList from "@/components/LeadList";
import React, { useState } from "react";
// import { useRouter } from "next/navigation";

const AdminPage: React.FC = () => {
  // const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy credentials: update these as needed
  const validUsername = "admin";
  const validPassword = "password";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate credentials
    if (username === validUsername && password === validPassword) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  // The modal overlay for authorization if not logged in.
  const renderAuthModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
        }}
      >
        <h2>Authorization</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Username</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type='submit'
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );

  // Render the page. If not authorized, we still render the leads list in the background,
  // but we overlay it with the auth modal.
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          opacity: authorized ? 1 : 0.5,
          pointerEvents: authorized ? "auto" : "none",
        }}
      >
        <h1>Admin Leads List</h1>

        <p>This is where your internal leads list will be displayed.</p>
        <LeadList />
      </div>
      {!authorized && renderAuthModal()}
    </div>
  );
};

export default AdminPage;
