import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Lead, LeadState } from "./data";

// In-memory leads array (for demo)
const leads: Lead[] = [];

export async function GET() {
  return NextResponse.json(leads, { status: 200 });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const newLead = {
    id: uuidv4(),
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    linkedin: formData.get("linkedin") as string,
    visas: formData.getAll("visas") as string[], // getAll for repeated fields
    additionalInfo: formData.get("additionalInfo") as string,
    resumeUrl: formData.get("resumeUrl") as string,
    state: LeadState.PENDING,
    submittedAt: new Date().toISOString(),
  };

  // Handle file if present
  const resume = formData.get("resume") as File | null;
  if (resume && resume.size > 0) {
    // In production, we'd upload to S3 or similar. We'll just store a placeholder path.
    newLead.resumeUrl = `/uploads/${resume.name}`;
  }

  leads.push(newLead);

  return NextResponse.json(newLead, { status: 201 });
}
