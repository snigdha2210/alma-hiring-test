import { Lead, LeadState } from "@/app/api/leads/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LeadsList {
  leads: Lead[];
}

const initialState: LeadsList = {
  leads: [],
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads(state, action: PayloadAction<Lead[]>) {
      state.leads = action.payload;
    },
    updateLeadState(
      state,
      action: PayloadAction<{
        id: string;
        newState: LeadState;
      }>,
    ) {
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
