export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET() {
  const notionDatabaseId = process.env.NOTION_DB_ID;
  const integrationToken = process.env.NOTION_SECRET;

  if (!notionDatabaseId || !integrationToken) {
    console.error("Missing Notion env variables.");
    return NextResponse.json(
      { error: "Missing Notion API credentials." },
      { status: 500 }
    );
  }

  const url = `https://api.notion.com/v1/databases/${notionDatabaseId}/query`;

  try {
    const response = await fetch(url, {
      method: "POST", // Notion DB query uses POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${integrationToken}`,
        "Notion-Version": "2021-08-16",
      },
      body: JSON.stringify({
        page_size: 5,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error querying Notion DB:", data);
      return NextResponse.json({ error: data }, { status: 500 });
    }

    const results = data.results.map((page) => {
      const nameProp = page.properties.Name;
      const title = nameProp?.title?.[0]?.text?.content || "Untitled";
      return {
        id: page.id,
        title,
      };
    });

    console.log("Fetched pages:", results);

    return NextResponse.json({ success: true, pages: results });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
