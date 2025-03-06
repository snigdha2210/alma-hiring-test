// redux/slices/leadSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  visas: string[];
  resumeUrl?: string; // or just store the file name
  additionalInfo: string;
  state: "PENDING" | "REACHED_OUT";
  submittedAt: string;
  country?: string; // if relevant from the UI
}

interface LeadsState {
  leads: Lead[];
}

const initialState: LeadsState = {
  leads: [],
};

export const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    updateLeadState: (
      state,
      action: PayloadAction<{
        id: string;
        newState: "PENDING" | "REACHED_OUT";
      }>,
    ) => {
      const { id, newState } = action.payload;
      const index = state.leads.findIndex((lead) => lead.id === id);
      if (index !== -1) {
        state.leads[index].state = newState;
      }
    },
  },
});

export const { setLeads, updateLeadState } = leadSlice.actions;
export default leadSlice.reducer;
