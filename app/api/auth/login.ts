// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Simple hardcoded check
  if (username === "admin" && password === "password") {
    // In production, we'd return a token or set a cookie
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
}
