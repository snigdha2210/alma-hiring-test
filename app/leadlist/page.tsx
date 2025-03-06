"use client";

import { setLeads, updateLeadState } from "@/redux/slices/leadSlice";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/AdminPage.module.css";
import { Lead, LeadState } from "../api/leads/data";
import { RootState } from "@/redux/store";
import { FaCheckCircle } from "react-icons/fa";
const AdminPage: React.FC = () => {
  // const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Local states for search, filtering, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // empty means no filter
  const [sortColumn, setSortColumn] = useState<
    "name" | "submitted" | "status" | "country" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  // Sorting function for leads
  const sortedLeads = useMemo(() => {
    let filtered = leads;

    // Filter by searchTerm (case-insensitive on full name)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((lead) =>
        `${lead.firstName} ${lead.lastName}`
          .toLowerCase()
          .includes(lowerSearch),
      );
    }

    // Filter by status (if set)
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.state === statusFilter);
    }

    // Sort filtered array if sortColumn is set
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = "";
        let bValue = "";

        switch (sortColumn) {
          case "name":
            aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
            bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case "submitted":
            aValue = a.submittedAt;
            bValue = b.submittedAt;
            break;
          case "status":
            aValue = a.state;
            bValue = b.state;
            break;
          case "country":
            aValue = a.country ? a.country.toLowerCase() : "";
            bValue = b.country ? b.country.toLowerCase() : "";
            break;
          default:
            break;
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [leads, searchTerm, statusFilter, sortColumn, sortOrder]);

  // Toggle sorting for a given column
  const handleSort = (column: "name" | "submitted" | "status" | "country") => {
    if (sortColumn === column) {
      // Toggle order if same column clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
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
            <div className={styles.sidebarLogo}>
              alma
              {/* <Image
                src='/images/alma-logo.png'
                alt='Alma Logo'
                width={100}
                height={30}
                className={styles.almaLogo}
              /> */}
            </div>
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

          {/* Filters: Search bar and status filter */}
          <div
            className={styles.filterContainer}
            style={{
              marginBottom: "1rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <input
              type='text'
              placeholder='Search by name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "0.5rem", flex: 1 }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "0.5rem" }}
            >
              <option value=''>All Statuses</option>
              <option value={LeadState.PENDING}>Pending</option>
              <option value={LeadState.REACHED_OUT}>Reached Out</option>
            </select>
          </div>

          <div className={styles.tableContainer}>
            {/* Table with sortable headers */}
            <table className={styles.leadsTable}>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer" }}
                  >
                    Name{" "}
                    {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("submitted")}
                    style={{ cursor: "pointer" }}
                  >
                    Submitted{" "}
                    {sortColumn === "submitted" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    style={{ cursor: "pointer" }}
                  >
                    Status{" "}
                    {sortColumn === "status" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => handleSort("country")}
                    style={{ cursor: "pointer" }}
                  >
                    Country{" "}
                    {sortColumn === "country" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Mark as Reached Out</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead: Lead) => (
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
                      {lead.state !== LeadState.PENDING ? (
                        <FaCheckCircle
                          color='green'
                          title='Reached Out'
                          size={20}
                        />
                      ) : (
                        <button
                          onClick={() =>
                            handleStateChange(lead.id, LeadState.REACHED_OUT)
                          }
                          // style={{ cursor: "pointer" }}
                          className={styles.iconButton}
                        >
                          <FaCheckCircle
                            color='grey'
                            title='Mark as Reached Out'
                            size={20}
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {sortedLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      No leads found.
                    </td>
                  </tr>
                )}
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
