import { NextRequest, NextResponse } from 'next/server';

const TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s=";
const TEABLE_PENDING_ORDERS_TABLE_ID = "tblpdCEnIQ9gguBi7F7";

export async function POST(req: NextRequest) {
  try {
    // Parse FormData
    const formData = await req.formData();
    const Name = formData.get('Name') as string;
    const Items = formData.get('Items') as string;
    const DeliveryStatus = formData.get('Delivery Status') as string;
    const Address = formData.get('Address') as string;
    const PaymentMethod = formData.get('Payment Method') as string;
    const AmountToPay = formData.get('Amount To Pay') as string;
    const PhoneNumber = formData.get('Phone Number') as string;
    const email = formData.get('email') as string;

    // Validate required fields
    const requiredFields = ['Name', 'Items', 'Delivery Status', 'Address', 'Payment Method', 'Amount To Pay', 'Phone Number', 'email'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Prepare payload for Teable
    const payload = {
      fieldKeyType: 'name',
      typecast: true,
      records: [
        {
          fields: {
            Name,
            Items,
            'Delivery Status': DeliveryStatus,
            Address,
            'Payment Method': PaymentMethod,
            'Amount To Pay': AmountToPay,
            'Phone Number': PhoneNumber,
            email,
          }
        }
      ]
    };

    // Send to Teable
    const url = `https://app.teable.io/api/table/${TEABLE_PENDING_ORDERS_TABLE_ID}/record`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TEABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      return NextResponse.json({ success: true, result }, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create order', details: result }, { status: response.status });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 