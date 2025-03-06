"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLeads, updateLeadState } from "@/redux/slices/leadSlice";
import { RootState } from "@/redux/store";
import { LeadState } from "@/app/api/leads/data";

import Filters from "@/components/Filters";
import LeadTable from "@/components/LeadTable";
import styles from "../styles/LeadList.module.css";
import Sidebar from "@/components/SideBar";
// import { FaCheckCircle } from "react-icons/fa";

const LeadList: React.FC = () => {
  // Authentication modal state
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy credentials
  const validUsername = "admin";
  const validPassword = "password";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === validUsername && password === validPassword) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

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

  // Local state for search, filtering, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<
    "name" | "submitted" | "status" | "country" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Derived sorted & filtered leads
  const sortedLeads = useMemo(() => {
    let filtered = leads;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((lead) =>
        `${lead.firstName} ${lead.lastName}`
          .toLowerCase()
          .includes(lowerSearch),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.state === statusFilter);
    }

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

  const handleSort = (column: "name" | "submitted" | "status" | "country") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleStateChange = async (id: string, newState: LeadState) => {
    try {
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

  return (
    <>
      <div className={styles.adminLayout}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h1 className={styles.pageHeader}>Leads</h1>
          <Filters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <LeadTable
            leads={sortedLeads}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            handleSort={handleSort}
            handleStateChange={handleStateChange}
          />
        </main>
      </div>
      {!authorized && renderAuthModal()}
    </>
  );
};

export default LeadList;
