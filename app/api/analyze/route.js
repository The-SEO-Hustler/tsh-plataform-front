import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Create document in Firebase
    const docRef = await addDoc(collection(db, "seoAnalyses"), {
      url,
      status: "pending",
      type: 'seo-check',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Here you would call your backend service

    const body = JSON.stringify({
      url: url,
      docId: docRef.id,
    });

    // console.log("will request with ", body);

    const backendResponse = await fetch(
      `${process.env.API_ENDPOINT}/seo-check`,
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await backendResponse.json();
    // console.log("response from back ", response);
    return NextResponse.json({
      docId: docRef.id,
      ...response,
    });
  } catch (error) {
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start analysis" },
      { status: 500 }
    );
  }
}
