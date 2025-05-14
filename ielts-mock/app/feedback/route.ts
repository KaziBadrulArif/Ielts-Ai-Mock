import { NextResponse } from "next/server"

// This is just to ensure the route is registered
export async function GET() {
  return NextResponse.json({ message: "Feedback route is working" })
}
