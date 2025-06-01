import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { filename } = params;

  const backendUrl = `${process.env.API_ENDPOINT}/screenshots/${filename}`;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.BACK_API_KEY,
    "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
    "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
  };

  // Or add your own auth headers
  // headers['authorization'] = `Bearer ${process.env.BACKEND_API_KEY}`;

  const backendRes = await fetch(backendUrl, {
    method: "GET",
    headers,
  });

  if (!backendRes.ok) {
    return new NextResponse("Unable to fetch image", {
      status: backendRes.status,
    });
  }

  const contentType = backendRes.headers.get("content-type");
  const arrayBuffer = await backendRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": buffer.length.toString(),
      // Optionally cache:
      // 'Cache-Control': 'public, max-age=3600',
    },
  });
}
