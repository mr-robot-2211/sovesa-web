import { NextRequest, NextResponse } from 'next/server';

const TEABLE_API_KEY = "teable_accX1rfXi2JYIQ1BUTu_N89wltHtHeoRWzZZrnNnXAmAic4MXWaxunPNCEZn65s=";
const TEABLE_PENDING_ORDERS_TABLE_ID = "tblpdCEnIQ9gguBi7F7";

export async function PATCH(req: NextRequest) {
  try {
    const { filterField, filterValue, updateFields } = await req.json();

    // 1. Find the record
    const findUrl = new URL(`https://app.teable.io/api/table/${TEABLE_PENDING_ORDERS_TABLE_ID}/record`);
    findUrl.searchParams.append("fieldKeyType", "name");
    findUrl.searchParams.append("filter", JSON.stringify({
      conjunction: "and",
      filterSet: [
        { fieldId: filterField, operator: "is", value: filterValue }
      ]
    }));

    const findResponse = await fetch(findUrl, {
      headers: { Authorization: `Bearer ${TEABLE_API_KEY}` }
    });
    const findResult = await findResponse.json();
    if (!findResult.records || findResult.records.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const recordId = findResult.records[0].id;

    // 2. Patch the record
    const updateUrl = `https://app.teable.io/api/table/${TEABLE_PENDING_ORDERS_TABLE_ID}/record/${recordId}`;
    const updatePayload = {
      fieldKeyType: "name",
      typecast: true,
      record: { fields: updateFields }
    };

    const updateResponse = await fetch(updateUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TEABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatePayload)
    });

    const updateResult = await updateResponse.json();
    if (updateResponse.ok) {
      return NextResponse.json({ success: true, updateResult });
    } else {
      return NextResponse.json({ error: "Failed to update", details: updateResult }, { status: updateResponse.status });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage || "Unknown error" }, { status: 500 });
  }
} 