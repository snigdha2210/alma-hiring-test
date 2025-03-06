export enum LeadState {
  PENDING = "PENDING",
  REACHED_OUT = "REACHED_OUT",
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  country: string;
  visas: string[];
  additionalInfo: string;
  state: LeadState;
  resumeUrl?: string;
  submittedAt: string;
}

export const leads: Lead[] = [];
