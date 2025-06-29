export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

const TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s=";
const TABLE_ID1 = "tblRsJIi2uOLDcpEE3j";

export async function GET() {
  const url = `https://app.teable.io/api/table/${TABLE_ID1}/record`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TEABLE_API_KEY}`,
        'Accept': 'application/json',
      },
      method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Teable API error:', data);
      return NextResponse.json({ error: 'Teable API error', details: data }, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 