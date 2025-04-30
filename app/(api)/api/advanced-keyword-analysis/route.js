// app/api/analysis/route.js

import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request) {
  try {
    let ip;
    if (process.env.NODE_ENV === "development") {
      ip = "3434"
    } else {
      ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
    }
    // Read JSON data from the request
    const formData = await request.formData();
    const keyword = formData.get("keyword");

    // Validate required fields if needed
    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "keywordAnalysis"), {
      keyword,
      type: "advanced-keyword-analysis",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Forward the request to your dedicated Node.js service endpoint
    const response = await fetch(
      `${process.env.API_ENDPOINT}/advanced-keyword-analysis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
          "x-ip": ip,
        },
        body: JSON.stringify({
          keyword: keyword,
          docId: docRef.id,
        }),
      }
    );

    const data = await response.json();
    // const response = { ok: true, status: "ok" };
    // const data = { keyword, contentType };
    // console.log("data", data);

    // Return the response from your Node.js service
    console.log("data", data);
    return NextResponse.json({ ...data, docId: docRef.id });
  } catch (error) {
    console.error("Error in analysis API route:", error);

    await updateDoc(doc(db, "keywordAnalysis", docRef.id), {
      status: "failed",
      error: error.message,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
