import { NextResponse } from "next/server";

const TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s=";
const TEABLE_PRODUCTS_TABLE_ID = "tbl5oyaGNkUOaSSGuqT";

export async function GET() {
  if (!TEABLE_API_KEY || !TEABLE_PRODUCTS_TABLE_ID) {
    return NextResponse.json({ error: "Missing Teable config" }, { status: 500 });
  }
  const url = `https://app.teable.io/api/table/${TEABLE_PRODUCTS_TABLE_ID}/record`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${TEABLE_API_KEY}` },
  });
  const data = await response.json();
  return NextResponse.json(data);
} 