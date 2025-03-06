// app/api/leads/route.ts
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { leads } from "./leadsStore";
import { LeadState } from "./data";

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
    visas: formData.getAll("visas") as string[],
    country: formData.get("country") as string,
    additionalInfo: formData.get("additionalInfo") as string,
    resumeUrl: "" as string,
    state: LeadState.PENDING,
    submittedAt: new Date().toISOString(),
  };

  // Handle file if present
  const resume = formData.get("resume") as File | null;
  if (resume && resume.size > 0) {
    // For demonstration, use a placeholder path.
    newLead.resumeUrl = `/uploads/${resume.name}`;
  }
  console.log(newLead);
  leads.push(newLead);
  console.log("done");
  console.log(leads);

  return NextResponse.json(newLead, { status: 201 });
}
