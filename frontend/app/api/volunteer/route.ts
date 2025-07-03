import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, phone, skill, description, name } = await req.json();

    const teableApiKey = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s=";
    const tableId = "tbllaVWYTfhtinTRYsU";
    const payload = {
      records: [
        {
          fields: {
            "Name": name || '',
            "phone number": phone ? Number(phone) : undefined,
            "email": email,
            "skill": skill,
            "description": description,
          }
        }
      ]
    };
    console.log('Teable payload:', JSON.stringify(payload));

    let teableRes;
    try {
      teableRes = await fetch(`https://app.teable.io/api/table/${tableId}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teableApiKey}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (fetchErr) {
      const errMsg = fetchErr instanceof Error ? fetchErr.message : JSON.stringify(fetchErr);
      console.error('Fetch to Teable failed:', errMsg);
      return NextResponse.json({ success: false, error: 'Fetch to Teable failed: ' + errMsg }, { status: 500 });
    }

    const debugText = await teableRes.text();
    console.log('Teable API status:', teableRes.status);
    console.log('Teable API response:', debugText);

    if (teableRes.ok) {
      return NextResponse.json({ success: true });
    } else {
      let errorMsg = debugText || 'Unknown error';
      try {
        const errorJson = JSON.parse(debugText);
        errorMsg = typeof errorJson === 'string' ? errorJson : JSON.stringify(errorJson);
      } catch {}
      return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('Unexpected error in volunteer API:', errMsg);
    return NextResponse.json({ success: false, error: 'Unexpected error: ' + errMsg }, { status: 500 });
  }
} 