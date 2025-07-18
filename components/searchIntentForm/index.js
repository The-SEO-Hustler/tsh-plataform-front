'use client'

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useFirebase } from "@/lib/firebase-context";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import { useUsage } from "@/lib/usage-context";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function SearchIntentEmbbed() {
  return (
    <RecaptchaProvider>
      <SearchIntentForm />
    </RecaptchaProvider>
  )
}

function SearchIntentForm() {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { trackAnalysis, currentAnalysis } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { usage, setUsage } = useUsage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    // Validate email if checkbox is checked
    // if (sendToEmail && !email) {
    //   setFormError("Please enter your email address to receive results.");
    //   return;
    // }

    // if (sendToEmail && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //   setFormError("Please enter a valid email address.");
    //   return;
    // }

    if (usage?.remaining <= 0) {
      toast.error(
        "You have reached your daily limit. Please try again tomorrow."
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
      const response = await fetch("/api/search-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          keyword,
          token,
          ...(sendToEmail && email && { email })
        }),
      });

      const data = await response.json();

      if (data.success) {
        trackAnalysis({
          type: "search-intent",
          docId: data.docId,
          collection: "searchIntent",
          meta: {
            url: url,
            keyword: keyword,
            // sendToEmail: sendToEmail,
            // email: email,
            preview: false,
          }
        });
        // router.push(`${getPathname("search-intent")}/result?id=${data.docId}`);
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
      setIsLoading(false);
      setFormError(error.message);
      // Show error message to user
    }
  };

  return (
    <div>

      <form onSubmit={handleSubmit} className="space-y-4  relative z-10">
        <div className="relative">
          <label htmlFor="keyword" className="text-xs text-foreground/80 top-0 left-2 absolute bg-background px-2 py-1  translate-y-[-50%]">Target Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setFormError("");
            }}
            placeholder="e.g., seo, content marketing"
            required
            disabled={isLoading}
            className="w-full px-4 sm:px-6 sm:pr-[160px] pr-[60px] py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
          />
        </div>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setFormError("");
            }}
            placeholder="https://example.com"
            required
            disabled={isLoading}
            className="w-full px-4 sm:px-6 sm:pr-[160px] pr-[60px] py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
          />
          <label htmlFor="url" className="text-xs text-foreground/80 top-0 left-2 absolute bg-background px-2 py-1  translate-y-[-50%]">Target URL</label>
        </div>

        {/* Email checkbox and field */}
        {/* <div className="space-y-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendToEmail}
                        onChange={(e) => {
                          setSendToEmail(e.target.checked);
                          setFormError("");
                        }}
                        disabled={isLoading}
                        className="w-4 h-4 text-primary bg-transparent border-2 border-gray-300 dark:border-foreground/80 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm text-foreground/80">Send results to my inbox</span>
                    </label>

                    {sendToEmail && (
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setFormError("");
                          }}
                          placeholder="your@email.com"
                          required={sendToEmail}
                          disabled={isLoading}
                          className="w-full px-4 sm:px-6 sm:pr-[160px] pr-[60px] py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                        />
                        <label htmlFor="email" className="text-xs text-foreground/80 top-0 left-2 absolute bg-background px-2 py-1 translate-y-[-50%]">Email Address</label>
                      </div>
                    )}
                  </div> */}

        <Button
          type="submit"
          size="lg"
          className={`w-full disabled:opacity-100 disabled:bg-gray-300 dark:disabled:bg-foreground/80 ${isLoading ? "animate-pulse !bg-primary " : ""
            }`}
          disabled={
            isLoading || usage?.remaining <= 0 || usage === null
          }
        >
          <span className="sm:block hidden">
            {isLoading ? "Starting Analysis..." : "Analyze Search Intent"}
          </span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {formError && <p className="text-red-500">{formError}</p>}
      </form>
      {formError && <p className="!text-red-500 !py-1 !my-1">{formError}</p>}
    </div>
  );
}

export default SearchIntentEmbbed;