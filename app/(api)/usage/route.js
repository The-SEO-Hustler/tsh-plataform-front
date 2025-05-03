import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  let ip;
  if (process.env.NODE_ENV === "development") {
    ip = "3435"
  } else {
    ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  }
  console.log('ip', ip);
  try {
    const response = await fetch(
      `${process.env.API_ENDPOINT}/usage`,
      {
        method: "GET",
        headers: {
          "x-ip": ip,
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
        },
      }
    );
    const data = await response.json();
    console.log('usage data', ip, data);
    return NextResponse.json(data);
  }
  catch (error) {
    console.log(error);
  }


  return NextResponse.json({ ip });
}