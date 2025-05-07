'use client'

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useFirebase } from "@/lib/firebase-context";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import { useUsage } from "@/lib/usage-context";
function SeoCheckEmbbed() {
  return (
    <RecaptchaProvider>
      <SeoCheckForm />
    </RecaptchaProvider>
  )
}

function SeoCheckForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { trackAnalysis, currentAnalysis, removeContentPlanning, removeLLMTxt, removeAdvancedKeywordAnalysis } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { usage, setUsage } = useUsage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    if (usage?.remaining <= 0) {
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }
    if (currentAnalysis && (currentAnalysis?.status !== "completed" && currentAnalysis?.status !== "failed")) {
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
      const response = await fetch('/api/seo-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, token }),
      });

      const data = await response.json();

      if (data.success) {
        removeContentPlanning();
        removeLLMTxt();
        removeAdvancedKeywordAnalysis();
        trackAnalysis(data.docId, url);
        // router.push(`/seo-check/result?id=${data.docId}`);
        setIsLoading(false);
        setUsage(prevUsage => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1
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

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
        <input
          className="bg-card text-foreground px-4 py-3 rounded-md w-full md:w-3/4 mb-3 md:mb-0 md:mr-3 focus:outline-none border border-foreground/10 focus:ring-2 focus:ring-black dark:focus:ring-foreground"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your website URL"
          required
          disabled={isLoading}
        />
        <button type="submit"
          className={`bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-md transition-all w-full md:w-1/4  cursor-pointer ${isLoading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-foreground/80`}
          disabled={isLoading || usage?.remaining <= 0 || usage === null}
        >
          {isLoading ? "Analyzing..." : "Analyze My Site Now"}
        </button>
      </form>
      {formError && <p className="!text-red-500 !py-1 !my-1">{formError}</p>}
    </div>
  );
}

export default SeoCheckEmbbed;