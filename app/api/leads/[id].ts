// pages/api/leads/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { leads } from "./data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const leadIndex = leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }

  if (req.method === "GET") {
    return res.status(200).json(leads[leadIndex]);
  }

  if (req.method === "PATCH") {
    const { newState } = req.body; // e.g., 'REACHED_OUT'
    leads[leadIndex].state = newState;
    return res.status(200).json(leads[leadIndex]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
