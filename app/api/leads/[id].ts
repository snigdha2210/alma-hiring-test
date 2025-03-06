import { NextResponse } from "next/server";
import { Lead } from "./data";

// Use the same in-memory leads from above or put them in a shared file
const leads: Lead[] = [];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  const body = await request.json();
  const leadIndex = leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  leads[leadIndex].state = body.newState;
  return NextResponse.json(leads[leadIndex], { status: 200 });
}
