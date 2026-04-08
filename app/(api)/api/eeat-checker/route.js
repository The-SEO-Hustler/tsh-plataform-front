// app/api/analysis/route.js

import { NextResponse } from "next/server";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dispatchBackendJob } from "@/lib/dispatchBackendJob";

export async function POST(request) {
  let docRef;
  try {
    let ip;
    if (process.env.NODE_ENV === "development") {
      ip = "3435"
    } else {
      ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
    }
    // Read JSON data from the request
    const formData = await request.formData();
    const url = formData.get("url");
    const query = formData.get("query");
    const userLocation = formData.get("userLocation")
    const taskLocale = formData.get("taskLocale")
    const userId = formData.get("userId");

    // Validate required fields if needed
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }
    if (!userLocation) {
      return NextResponse.json(
        { error: "User Location is required" },
        { status: 400 }
      );
    }

    docRef = await addDoc(collection(db, "evaluations"), {
      url,
      query,
      userLocation,
      taskLocale,
      ...(userId ? { userId } : {}),
      type: "evaluation",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Forward the request to your dedicated Node.js service endpoint
    const dispatchResult = await dispatchBackendJob(
      `${process.env.API_ENDPOINT}/search-quality-evaluator/evaluations`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
          "x-ip": ip,
        },
        body: JSON.stringify({
          landingPageURL: url,
          userQuery: query,
          userLocation: userLocation,
          taskLocale: taskLocale,
          docId: docRef.id,
          ...(userId ? { userId } : {}),
        }),
        timeoutMs: 12000,
      }
    );

    if (!dispatchResult.accepted) {
      console.warn("eeat-checker dispatch not confirmed", dispatchResult);
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
    console.error("Error in evaluation API route:", error);

    if (docRef?.id) {
      await updateDoc(doc(db, "evaluations", docRef.id), {
        status: "failed",
        error: error.message,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
