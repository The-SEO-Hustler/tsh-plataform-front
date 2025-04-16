import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request) {
  try {
    const { url, token } = await request.json();
    // Verify reCAPTCHA token
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const recaptchaResponse = await fetch(verificationUrl, {
      method: "POST",
    });

    const recaptchaData = await recaptchaResponse.json();
    console.log("reCAPTCHA verification response:", recaptchaData);

    if (!recaptchaData.success) {
      console.error(
        "reCAPTCHA verification failed:",
        recaptchaData["error-codes"]
      );
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Create document in Firebase
    const docRef = await addDoc(collection(db, "seoAnalyses"), {
      url,
      status: "pending",
      type: "seo-check",
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
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
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
