// pages/admin/index.tsx
import React, { useEffect } from "react";
import AuthGuard from "../../components/AuthGuard";
import LeadList from "../../components/LeadList";
import { useDispatch } from "react-redux";
import { setLeads } from "../../redux/slices/leadSlice";

const AdminPage: React.FC = () => {
  const dispatch = useDispatch();

  // Fetch leads from API on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        dispatch(setLeads(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchLeads();
  }, [dispatch]);

  return (
    <AuthGuard>
      <div style={{ padding: "20px" }}>
        <h1>Leads</h1>
        <LeadList />
      </div>
    </AuthGuard>
  );
};

export default AdminPage;
