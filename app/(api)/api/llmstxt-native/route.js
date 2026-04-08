// app/api/llmstxt-native/route.js

import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dispatchBackendJob } from "@/lib/dispatchBackendJob";

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
    const { url, mode, maxUrls, userId } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!mode || mode !== "firecrawl") {
      return NextResponse.json(
        { error: "Mode must be 'firecrawl'" },
        { status: 400 }
      );
    }

    // Validate maxUrls
    if (maxUrls === undefined || maxUrls === null) {
      return NextResponse.json(
        { error: "maxUrls is required" },
        { status: 400 }
      );
    }

    if (typeof maxUrls !== "number" || maxUrls < 1 || maxUrls > 10) {
      return NextResponse.json(
        { error: "maxUrls must be a number between 1 and 10" },
        { status: 400 }
      );
    }

    // Create document in Firestore
    docRef = await addDoc(collection(db, "llmstxt"), {
      url,
      mode,
      maxUrls,
      ...(userId ? { userId } : {}),
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
      maxUrls: maxUrls,
      ...(userId ? { userId } : {}),
    };

    // Forward the request to your dedicated Node.js service endpoint
    const dispatchResult = await dispatchBackendJob(`${process.env.API_ENDPOINT}/llmstxt-native`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACK_API_KEY,
        "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
        "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
        "x-ip": ip,
      },
      body: JSON.stringify(requestBody),
      timeoutMs: 12000,
    });

    if (!dispatchResult.accepted) {
      console.warn("llmstxt-native dispatch not confirmed", dispatchResult);
    }

    return NextResponse.json({
      success: true,
      queued: true,
      docId: docRef.id,
      dispatch: {
        accepted: dispatchResult.accepted,
        status: dispatchResult.status,
      },
    });
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
