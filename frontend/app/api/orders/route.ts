import { NextResponse } from "next/server";

const TEABLE_API_KEY = process.env.TEABLE_API_KEY;
const TEABLE_ORDERS_TABLE_ID = process.env.TEABLE_ORDERS_TABLE_ID;

export async function POST(req: Request) {
  if (!TEABLE_API_KEY || !TEABLE_ORDERS_TABLE_ID) {
    return NextResponse.json({ error: "Missing Teable config" }, { status: 500 });
  }
  const body = await req.json();
  const url = `https://app.teable.io/api/table/${TEABLE_ORDERS_TABLE_ID}/record`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TEABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: body }),
  });
  const data = await response.json();
  return NextResponse.json(data);
} 