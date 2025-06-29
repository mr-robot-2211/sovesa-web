import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string; courseId: string }> }
) {
  const TEABLE_API_KEY = process.env.TEABLE_API_KEY;
  const TEABLE_USERS_TABLE_ID = process.env.TEABLE_USERS_TABLE_ID;
  
  if (!TEABLE_API_KEY) {
    return NextResponse.json({ error: 'Missing TEABLE_API_KEY' }, { status: 500 });
  }
  
  if (!TEABLE_USERS_TABLE_ID) {
    return NextResponse.json({ error: 'Missing TEABLE_USERS_TABLE_ID' }, { status: 500 });
  }

  try {
    const { email, courseId } = await params;
    
    if (!email || !courseId) {
      return NextResponse.json({ error: 'Email and courseId are required' }, { status: 400 });
    }

    // Find the user record by email
    const findUrl = new URL(`https://app.teable.io/api/table/${TEABLE_USERS_TABLE_ID}/record`);
    const params_filter = {
      fieldKeyType: "name",
      filter: JSON.stringify({
        "conjunction": "and",
        "filterSet": [
          {
            "fieldId": "email",
            "operator": "is",
            "value": email
          }
        ]
      })
    };

    Object.entries(params_filter).forEach(([key, value]) => {
      findUrl.searchParams.append(key, value);
    });

    const findResponse = await fetch(findUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TEABLE_API_KEY}`,
        "Accept": "application/json"
      }
    });

    const findResult = await findResponse.json();
    
    if (findResponse.ok && findResult.records && findResult.records.length > 0) {
      const userRecord = findResult.records[0];
      const userCourses = userRecord.fields?.courses || [];
      
      // Check if the courseId exists in the user's courses array
      const isRegistered = Array.isArray(userCourses) && userCourses.includes(courseId);
      
      return NextResponse.json({ 
        success: true,
        isRegistered,
        data: isRegistered
      });
    } else {
      return NextResponse.json({ 
        success: true,
        isRegistered: false,
        data: false
      });
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 