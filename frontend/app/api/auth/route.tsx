import { NextResponse } from "next/server";

const DJANGO_AUTH_URL = "http://127.0.0.1:8000/auth";

export async function POST(req: Request) {
  const { email, password, type } = await req.json();

  if (!email || !password || !type) {
    return NextResponse.json({ error: "Missing email, password, or auth type" }, { status: 400 });
  }

  try {
    const res = await fetch(`${DJANGO_AUTH_URL}/${type}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // ✅ Now sending both email & password
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
