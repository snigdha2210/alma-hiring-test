"use client";

import { setLeads, updateLeadState } from "@/redux/slices/leadSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/AdminPage.module.css";
import { Lead, LeadState } from "../api/leads/data";
import { RootState } from "@/redux/store";

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
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();
        dispatch(setLeads(data));
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [dispatch]);
  // Update lead state via API + Redux
  const handleStateChange = async (id: string, newState: LeadState) => {
    try {
      console.log("id", id);
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newState }),
      });
      if (res.ok) {
        dispatch(updateLeadState({ id, newState }));
      }
    } catch (error) {
      console.error("Error updating lead state:", error);
    }
  };

  // Render the page. If not authorized, we still render the leads list in the background,
  // but we overlay it with the auth modal.
  return (
    <>
      <div className={styles.adminLayout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.sidebarLogo}>almà</div>
            <nav className={styles.sidebarNav}>
              <a className={styles.sidebarNavItem}>Leads</a>
              <a className={styles.sidebarNavItem}>Settings</a>
            </nav>
          </div>
          <div className={styles.sidebarBottom}>
            <div className={styles.sidebarNavItem}>Admin</div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          <h1 className={styles.pageHeader}>Leads</h1>

          <div className={styles.tableContainer}>
            {/* Optional Title Bar with Filters */}
            <div className={styles.tableTitleBar}>
              <div>
                <strong>All Leads</strong>
              </div>
              <div className={styles.tableFilters}>
                <select defaultValue=''>
                  <option value=''>Status</option>
                  <option value='PENDING'>Pending</option>
                  <option value='REACHED_OUT'>Reached Out</option>
                </select>
                <select defaultValue=''>
                  <option value=''>Country</option>
                  <option value='Mexico'>Mexico</option>
                  <option value='Brazil'>Brazil</option>
                  <option value='France'>France</option>
                  {/* etc */}
                </select>
              </div>
            </div>

            <table className={styles.leadsTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Country</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: Lead) => (
                  <tr key={lead.id}>
                    <td>{`${lead.firstName} ${lead.lastName}`}</td>
                    <td>{new Date(lead.submittedAt).toLocaleString()}</td>
                    <td>
                      {lead.state === LeadState.PENDING ? (
                        <span className={styles.statusPending}>Pending</span>
                      ) : (
                        <span className={styles.statusReached}>
                          Reached Out
                        </span>
                      )}
                    </td>
                    <td>{lead.country || "—"}</td>
                    <td>
                      {lead.state === LeadState.PENDING && (
                        <button
                          onClick={() =>
                            handleStateChange(lead.id, LeadState.REACHED_OUT)
                          }
                          style={{ cursor: "pointer" }}
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
        </main>
      </div>

      {!authorized && renderAuthModal()}
    </>
  );
};

export default AdminPage;
