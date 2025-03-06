// components/Filters.tsx
"use client";

import React from "react";
import { LeadState } from "@/app/api/leads/data";
import styles from "../app/styles/AdminPage.module.css";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
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
        style={{ padding: "0.5rem", flex: 1, borderRadius: "10px" }}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "10px" }}
      >
        <option value=''>All Statuses</option>
        <option value={LeadState.PENDING}>Pending</option>
        <option value={LeadState.REACHED_OUT}>Reached Out</option>
      </select>
    </div>
  );
};

export default Filters;
