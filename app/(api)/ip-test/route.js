import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  console.log('ip', ip);
  return NextResponse.json({ ip });
}