import { NextResponse } from "next/server";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dispatchBackendJob } from "@/lib/dispatchBackendJob";

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for");
    const { url, keyword, token, sendToEmail, email, userId } = await request.json();
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
    const docRef = await addDoc(collection(db, "searchIntent"), {
      url,
      keyword,
      ...(userId ? { userId } : {}),
      // sendToEmail,
      // email,
      status: "pending",
      type: "search-intent",
      preview: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Here you would call your backend service

    const body = JSON.stringify({
      url: url,
      keyword: keyword,
      docId: docRef.id,
      ...(userId ? { userId } : {}),
    });

    // console.log("will request with ", body);

    const dispatchResult = await dispatchBackendJob(
      `${process.env.API_ENDPOINT}/search-intent`,
      {
        body,
        headers: {
          "Content-Type": "application/json",
          "x-ip": ip,
          "x-api-key": process.env.BACK_API_KEY,
          "CF-Access-Client-Id": process.env.CF_Access_Client_Id,
          "CF-Access-Client-Secret": process.env.CF_Access_Client_Secret,
        },
        timeoutMs: 10000,
      }
    );

    if (!dispatchResult.accepted) {
      console.warn("search-intent dispatch not confirmed", dispatchResult);
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
    console.error("Error in analyze route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start analysis" },
      { status: 500 }
    );
  }
}
