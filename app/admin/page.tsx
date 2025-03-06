"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null; // or a loading spinner
  }
  // Fetch leads from an API endpoint or in-memory data on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, []);

  // Function to handle lead state change
  const handleStateChange = async (id: string, newState: "REACHED_OUT") => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newState }),
      });
      if (res.ok) {
        // Update local state
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === id ? { ...lead, state: newState } : lead,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating lead state:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Leads List</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Name</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Visas</th>
            <th style={{ textAlign: "left" }}>State</th>
            <th style={{ textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{`${lead.firstName} ${lead.lastName}`}</td>
              <td>{lead.email}</td>
              <td>{lead.visas.join(", ")}</td>
              <td>{lead.state}</td>
              <td>
                {lead.state === "PENDING" && (
                  <button
                    onClick={() => handleStateChange(lead.id, "REACHED_OUT")}
                  >
                    Mark as Reached Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
