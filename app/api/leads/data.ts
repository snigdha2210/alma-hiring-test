// pages/api/leads/data.ts

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  visas: string[];
  resumeUrl?: string;
  additionalInfo: string;
  state: "PENDING" | "REACHED_OUT";
  submittedAt: string;
  country?: string; // optional
}

export const leads: Lead[] = [];
