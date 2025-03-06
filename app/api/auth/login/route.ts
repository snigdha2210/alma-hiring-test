import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Mock credentials
  if (username === "admin" && password === "password") {
    // Return success
    return NextResponse.json({ success: true }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
