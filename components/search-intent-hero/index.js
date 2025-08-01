"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import { ArrowRight, CheckCircle2, Search, Target, Gauge, Lightbulb } from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useUsage } from "@/lib/usage-context";
import { getPathname } from "@/lib/getpathname";
import HeroTemplate from "../HeroTemplate";

function SearchIntentHeroContent() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [sendToEmail, setSendToEmail] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const {
    currentAnalysis,
    trackAnalysis,
    clearAnalysis,
  } = useFirebase();
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
    if (usage.status === "error" || !usage) {
      toast.error("Please try again later, our team is working on it.");
      fetch("/api/notifySlack", {
        method: "POST",
        body: JSON.stringify({
          status: "info",
          docId: "No response from server",
          route: "search-intent",
        }),
      });

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
        router.push(`${getPathname("search-intent")}/result?id=${data.docId}`);
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
      // Show error message to user
    }
  };

  useEffect(() => {
    document.body.classList.add("hide-badge");
    return () => {
      document.body.classList.remove("hide-badge");
    };
  }, []);

  return (
    <main className="min-h-screen relative  py-6 md:py-0">
      {/* Hero Section*/}

      <section className="bg-background">
        <HeroTemplate noBg className="!md:pt-0 !pb-0 !md:pb-0 !mt-0 !pt-0 ">
          <Container id="hero">
            <section className="min-h-[calc(100vh-10px)] flex items-center relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - URL Input */}
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Free <span className="text-primary">Search Intent Tool</span>{" "}
                    That Actually Helps You Grow
                  </h1>
                  {/* <p className="text-xl text-foreground">
                  Is Your Website Invisible to Google? Let&apos;s Fix That.
                </p> */}
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
                  <div className="flex gap-2 flex-col">
                    <div className="flex items-center gap-4 text-foreground">
                      <CheckCircle2 className="min-h-5 min-w-5 text-green-700 dark:text-green-400" />
                      <span>
                        No registration required. Free, instant results.
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="min-h-5 min-w-5 text-foreground" />
                      <span className="text-xs text-foreground">
                        This site is protected by reCAPTCHA and the Google
                        <a
                          href="https://policies.google.com/privacy"
                          className="text-primary ml-1  "
                        >
                          Privacy Policy
                        </a>{" "}
                        and
                        <a
                          href="https://policies.google.com/terms"
                          className="text-primary ml-1"
                        >
                          Terms of Service
                        </a>{" "}
                        apply.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Feature Preview */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl -z-10" />
                  <div className="bg-card p-8 rounded-2xl shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target strokeWidth={1.25} className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Search Intent</h3>
                          <p className="text-sm text-foreground/80">
                            Get a professional grade Needs Meet and Page Quality assessment for free.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Needs Meet</span>
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            Optimized
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Page Quality</span>
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            Excellent
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </HeroTemplate>
      </section >

      <section className="py-16 bg-background border-t border-foreground/10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What You&apos;ll Get from This Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-100 dark:bg-black rounded-lg p-6 text-center border border-foreground/10">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Target size={24} />
                </div>
                <h3 className="font-bold mb-2">Intent Classification</h3>
                <p className="text-foreground/80 text-sm">Understand if users want information, navigation, comparison, or to buy</p>
              </div>
              <div className="bg-gray-100 dark:bg-black rounded-lg p-6 text-center border border-foreground/10">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Gauge size={24} />
                </div>
                <h3 className="font-bold mb-2">URL Alignment Score</h3>
                <p className="text-foreground/80 text-sm">See how well your content matches search intent expectations</p>
              </div>
              <div className="bg-gray-100 dark:bg-black rounded-lg p-6 text-center border border-foreground/10">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Lightbulb size={24} />
                </div>
                <h3 className="font-bold mb-2">Actionable Suggestions</h3>
                <p className="text-foreground/80 text-sm">Get specific recommendations to improve content alignment</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main >
  );
}

export default function SearchIntentHero() {
  return (
    <RecaptchaProvider>
      <SearchIntentHeroContent />
    </RecaptchaProvider>
  );
}
