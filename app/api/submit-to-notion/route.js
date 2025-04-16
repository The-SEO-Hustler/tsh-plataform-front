export const runtime = "edge";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        {
          status: 405,
        }
      );
    }

    // Log the raw request for debugging
    console.log("Request headers:", JSON.stringify(Object.fromEntries(req.headers)));

    // Try to get the raw body text first for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Try to parse the body as JSON
    let body;
    try {
      body = JSON.parse(rawBody);
      console.log("Parsed body:", body);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON format", details: parseError.message },
        { status: 400 }
      );
    }

    const { name, email, message, token } = body;

    // Verify reCAPTCHA token
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const recaptchaResponse = await fetch(verificationUrl, {
      method: "POST",
    });

    const recaptchaData = await recaptchaResponse.json();
    console.log("reCAPTCHA verification response:", recaptchaData);

    if (!recaptchaData.success) {
      console.error("reCAPTCHA verification failed:", recaptchaData["error-codes"]);
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields:", { name, email, message });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const notionDatabaseId = process.env.NOTION_DB_ID;
    const integrationToken = process.env.NOTION_SECRET;

    // Check if environment variables are set
    if (!notionDatabaseId || !integrationToken) {
      console.error("Missing environment variables:", {
        hasNotionDbId: !!notionDatabaseId,
        hasIntegrationToken: !!integrationToken
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const url = `https://api.notion.com/v1/pages`;

    const data = {
      parent: { database_id: notionDatabaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },

        Message: {
          rich_text: [
            {
              text: {
                content: message,
              },
            },
          ],
        },
      },
    };

    console.log("Sending data to Notion:", JSON.stringify(data));

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${integrationToken}`,
        "Notion-Version": "2021-08-16",
      },
      body: JSON.stringify(data),
    });

    if (result.status !== 200) {
      const error = await result.json();
      console.error("Notion API error:", error);
      return NextResponse.json(
        { message: error.message || "Error saving to Notion" },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message: "Thank you! we'll answer you shortly",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      {
        status: 500,
      }
    );
  }
}
