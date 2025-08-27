// app/api/llmstxt-native/route.js

import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request) {
  let docRef;

  try {
    let ip;
    if (process.env.NODE_ENV === "development") {
      ip = "3435";
    } else {
      ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
        ","
      )[0];
    }

    // Read JSON data from the request
    const body = await request.json();
    const { url, mode, additionalUrls } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!mode || !["simple", "advanced"].includes(mode)) {
      return NextResponse.json(
        { error: "Mode must be 'simple' or 'advanced'" },
        { status: 400 }
      );
    }

    // Validate additional URLs for advanced mode
    if (mode === "advanced" && additionalUrls) {
      if (!Array.isArray(additionalUrls)) {
        return NextResponse.json(
          { error: "additionalUrls must be an array" },
          { status: 400 }
        );
      }

      if (additionalUrls.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 additional URLs allowed" },
          { status: 400 }
        );
      }

      // Validate each URL format
      const urlRegex = /^https?:\/\/.+/;
      const invalidUrls = additionalUrls.filter((url) => !urlRegex.test(url));
      if (invalidUrls.length > 0) {
        return NextResponse.json(
          { error: `Invalid URLs: ${invalidUrls.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Create document in Firestore
    docRef = await addDoc(collection(db, "llmstxt"), {
      url,
      mode,
      additionalUrls: mode === "advanced" ? additionalUrls : [],
      type: "llmstxt",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Prepare request body for the backend service
    const requestBody = {
      url: url,
      docId: docRef.id,
      mode: mode,
    };

    // Add additional URLs for advanced mode
    if (mode === "advanced" && additionalUrls && additionalUrls.length > 0) {
      requestBody.additionalUrls = additionalUrls;
    }

    // Forward the request to your dedicated Node.js service endpoint
    const response = await fetch(`${process.env.API_ENDPOINT}/llmstxt-native`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACK_API_KEY,
        "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
        "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
        "x-ip": ip,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    // Return the response from your Node.js service
    return NextResponse.json({ ...data, docId: docRef.id, success: true });
  } catch (error) {
    console.error("Error in llmstxt-native API route:", error);

    // Update document status to failed if we have a docRef
    if (docRef) {
      try {
        await updateDoc(doc(db, "llmstxt", docRef.id), {
          status: "failed",
          error: error.message,
          updatedAt: new Date(),
        });
      } catch (updateError) {
        console.error("Error updating document status:", updateError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
