// app/api/leads/[id]/route.ts
import { NextResponse } from "next/server";
import { leads } from "../leadsStore";
import { LeadState } from "../data";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Insert a zero-delay to ensure dynamic params are fully resolved.
  await new Promise((resolve) => setTimeout(resolve, 0));

  // Now read the dynamic parameter.
  const { id } = await Promise.resolve(params);
  const body = await request.json();

  const leadIndex = leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  leads[leadIndex].state = body.newState || LeadState.PENDING;
  return NextResponse.json(leads[leadIndex], { status: 200 });
}
