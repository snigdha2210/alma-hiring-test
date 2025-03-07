import React, { useState } from "react";
import { Lead, LeadState } from "@/app/api/leads/data";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../app/styles/LeadList.module.css";

interface LeadTableProps {
  leads: Lead[];
  sortColumn: "name" | "submitted" | "status" | "country" | "";
  sortOrder: "asc" | "desc";
  handleSort: (column: "name" | "submitted" | "status" | "country") => void;
  handleStateChange: (id: string, newState: LeadState) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  sortColumn,
  sortOrder,
  handleSort,
  handleStateChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of leads per page

  const totalPages = Math.ceil(leads.length / pageSize);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className={styles.tableContainer}>
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
                {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("country")}
                style={{ cursor: "pointer" }}
              >
                Country{" "}
                {sortColumn === "country" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th>Mark as Reached Out</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead: Lead) => (
              <tr key={lead.id}>
                <td>{`${lead.firstName} ${lead.lastName}`}</td>
                <td>{new Date(lead.submittedAt).toLocaleString()}</td>
                <td>
                  {lead.state === LeadState.PENDING ? (
                    <span className={styles.statusPending}>Pending</span>
                  ) : (
                    <span className={styles.statusReached}>Reached Out</span>
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
            {paginatedLeads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={styles.paginationContainer}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default LeadTable;
