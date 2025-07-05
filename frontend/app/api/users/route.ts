import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log("✅ /api/users POST route triggered");
  const TEABLE_API_KEY = process.env.TEABLE_API_KEY;
  const TEABLE_USERS_TABLE_ID = process.env.TEABLE_USERS_TABLE_ID;
  
  if (!TEABLE_API_KEY) {
    return NextResponse.json({ error: 'Missing TEABLE_API_KEY' }, { status: 500 });
  }
  
  if (!TEABLE_USERS_TABLE_ID) {
    return NextResponse.json({ error: 'Missing TEABLE_USERS_TABLE_ID' }, { status: 500 });
  }
  
  const url = `https://app.teable.io/api/table/${TEABLE_USERS_TABLE_ID}/record`;

  try {
    const body = await req.json();
    
    const name = body.name as string;
    const email = body.email as string;
    const profile_photo = body.profile_photo as string;

    // Validate required fields
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const teablePayload = {
      fieldKeyType: 'name',
      typecast: true,
      records: [
        {
          fields: {
            name,
            email,
            profile_photo: profile_photo || '',
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teablePayload),
    });
    
    const result = await response.json();
    
    if (response.status === 200 || response.status === 201) {
      return NextResponse.json({ 
        message: 'User data stored successfully!',
        userId: result.data?.insertRecords?.[0]?.id
      }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Teable error', details: result }, { status: response.status });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 