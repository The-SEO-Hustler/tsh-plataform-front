"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useFirebase } from "@/lib/firebase-context";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import { useUsage } from "@/lib/usage-context";
import AuthHistoryTooltip from "@/components/AuthHistoryTooltip";
import { useRouter } from "next/navigation";
import { getPathname } from "@/lib/getpathname";
function SeoCheckEmbbed() {
  return (
    <RecaptchaProvider>
      <SeoCheckForm />
    </RecaptchaProvider>
  );
}

function SeoCheckForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { trackAnalysis, currentAnalysis, user } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { usage, setUsage } = useUsage();

  const normalizeUrl = (raw) => {
    const input = String(raw || "").trim();
    if (!input) return "";
    const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    try {
      const u = new URL(withScheme);
      return u.toString();
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) {
      setFormError("Please enter a valid website (e.g. example.com).");
      return;
    }
    if (usage?.remaining <= 0) {
      toast.error(
        "You have reached your daily limit. Please try again tomorrow.",
      );
      return;
    }
    if (
      currentAnalysis &&
      currentAnalysis?.status !== "completed" &&
      currentAnalysis?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    setIsLoading(true);

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      setFormError("Recaptcha not ready. Please try again later.");
      setIsLoading(false);
      return;
    }

    console.log("Executing reCAPTCHA...");
    const token = await executeRecaptcha("contact_form");
    console.log("reCAPTCHA token:", token);

    try {
      const response = await fetch("/api/seo-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl, token, userId: user?.uid }),
      });

      const data = await response.json();

      if (data.success) {
        trackAnalysis({
          type: "seo-check",
          docId: data.docId,
          collection: "seoAnalyses",
          meta: {
            url: normalizedUrl,
          },
        });
        router.push(`${getPathname("seo-check")}/result?id=${data.docId}`);
        setIsLoading(false);
        setUsage((prevUsage) => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1,
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error starting analysis:", error);
      setFormError(error.message);
      setIsLoading(false);
      // Show error message to user
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            className="w-full px-4 sm:px-6 sm:pr-[260px] pr-[60px] py-4 text-lg border-2 border-border/70 dark:border-foreground/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
            type="text"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            value={url}
            onChange={(e) => {
              setFormError("");
              setUrl(e.target.value);
            }}
            placeholder="example.com"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-md transition-all ${isLoading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-foreground/80`}
            disabled={isLoading || usage?.remaining <= 0 || usage === null}
          >
            <span className="sm:block hidden">
              {isLoading ? "Analyzing..." : "Analyze My Site Now"}
            </span>
            <span className="sm:hidden block">→</span>
          </button>
        </div>
      </form>
      <AuthHistoryTooltip isLoggedIn={!!user} />
      {formError && <p className="!text-red-500 !py-1 !my-1">{formError}</p>}
    </div>
  );
}

export default SeoCheckEmbbed;
