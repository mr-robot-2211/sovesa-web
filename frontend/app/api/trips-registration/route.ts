import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const TEABLE_API_KEY = process.env.TEABLE_API_KEY;
  const TEABLE_USERS_TABLE_ID = process.env.TEABLE_USERS_TABLE_ID;
  
  if (!TEABLE_API_KEY) {
    return NextResponse.json({ error: 'Missing TEABLE_API_KEY' }, { status: 500 });
  }
  
  if (!TEABLE_USERS_TABLE_ID) {
    return NextResponse.json({ error: 'Missing TEABLE_USERS_TABLE_ID' }, { status: 500 });
  }

  try {
    // Parse FormData
    const formData = await req.formData();
    
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const student_id = formData.get('student_id') as string;
    const trips = formData.get('trips') as string;
    const paymentFile = formData.get('paymentFile') as File | null;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'student_id'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Validate trips field separately
    if (!formData.get('trips')) {
      return NextResponse.json({ error: 'Missing field: trips' }, { status: 400 });
    }

    // // Handle file upload if present
    // let fileUrl = '';
    // if (paymentFile) {
    //   fileUrl = `Payment screenshot uploaded: ${paymentFile.name}`;
    // }

    // Update user's trips field in users table
    try {
      // First, find the user record by email
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
        const recordId = userRecord.id;

        // Get existing trips array or create new one
        const existingTrips = userRecord.fields?.trips || [];
        const updatedTrips = Array.isArray(existingTrips) 
          ? [...existingTrips, trips].filter((trip, index, arr) => arr.indexOf(trip) === index) // Remove duplicates
          : [trips];

        // Update the user record with trips, studentId and phone
        const updateUrl = `https://app.teable.io/api/table/${TEABLE_USERS_TABLE_ID}/record/${recordId}`;
        const updatePayload = {
          fieldKeyType: 'name',
          typecast: true,
          record: {
            fields: {
              trips: updatedTrips,
              studentId: student_id,
              phone: phone, // Also update phone if it changed
            }
          }
        };

        const updateResponse = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${TEABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload),
        });

        if (updateResponse.ok) {
          return NextResponse.json({ 
            message: 'Trip registration successful!',
            fileUploaded: !!paymentFile 
          }, { status: 201 });
        } else {
          const updateResult = await updateResponse.json();
          return NextResponse.json({ error: 'Failed to update user data', details: updateResult }, { status: updateResponse.status });
        }
      } else {
        return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 