// pages/login.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        // Mock: store a flag in localStorage to indicate "logged in"
        localStorage.setItem("isLoggedIn", "true");
        router.push("/admin");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Password</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Log In</button>
      </form>
    </div>
  );
}
