import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    // Read JSON data from the request
    const formData = await request.json();
    const url = formData.url;
    const docId = formData.docId;

    // Validate required fields if needed
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }



    // Forward the request to your dedicated Node.js service endpoint
    const response = await fetch(
      `${process.env.API_ENDPOINT}/advanced-keyword-analysis/extract-info-from-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
        },
        body: JSON.stringify({
          url: url,
          docId: docId,
        }),
      }
    );

    const data = await response.json();
    console.log("data", data);
    return NextResponse.json({ ...data, docId: docId });
  } catch (error) {
    console.error("Error in analysis API route:", error);



    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
