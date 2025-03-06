import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { updateLeadState } from "../redux/slices/leadSlice";
import { LeadState } from "@/app/api/leads/data";

const LeadList: React.FC = () => {
  const leads = useSelector((state: RootState) => state.leads.leads);
  const dispatch = useDispatch();

  const handleStateChange = async (
    id: string,
    newState: LeadState.REACHED_OUT,
  ) => {
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
      console.error(error);
    }
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Submitted</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id}>
            <td>{`${lead.firstName} ${lead.lastName}`}</td>
            <td>{new Date(lead.submittedAt).toLocaleString()}</td>
            <td>{lead.state}</td>
            <td>
              {lead.state === "PENDING" && (
                <button
                  onClick={() =>
                    handleStateChange(lead.id, LeadState.REACHED_OUT)
                  }
                >
                  Mark as Reached Out
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeadList;
