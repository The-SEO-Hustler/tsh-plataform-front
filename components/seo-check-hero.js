"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
export default function SeoCheckHero() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { trackAnalysis, currentAnalysis, removeContentPlanning } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
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
        trackAnalysis(data.docId, url);
        router.push(`/seo-check?id=${data.docId}`);
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
    }

  }, [])


  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#eaeae9] to-white py-6 md:py-0">
      {/* Hero Section*/}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <Container>
        <section className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - URL Input */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Analyze Your Website&apos;s
                <span className="text-primary"> SEO Performance</span>
              </h1>
              <p className="text-xl ">
                Get comprehensive insights and actionable recommendations to
                improve your website&apos;s search engine rankings.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your website URL"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 ${isLoading ? "animate-pulse" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Starting Analysis..." : "Analyze"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
              <div className="flex gap-2 flex-col">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                  <span>Free analysis - No registration required</span>
                </div>
                <div className="flex items-center gap-4">
                  <ShieldCheck className="h-5 w-5 text-gray-500" />
                  <span className="text-xs text-gray-500">This site is protected by reCAPTCHA and the Google
                    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                    <a href="https://policies.google.com/terms">Terms of Service</a> apply.</span>
                </div>
              </div>
            </div>

            {/* Right Column - Feature Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl -z-10" />
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">SEO Score</h3>
                      <p className="text-sm text-gray-500">
                        Overall performance rating
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Meta Tags</span>
                      <span className="text-sm font-medium text-green-700">
                        Optimized
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Quality</span>
                      <span className="text-sm font-medium text-yellow-700">
                        Needs Improvement
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Responsiveness</span>
                      <span className="text-sm font-medium text-green-700">
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
    </main>
  );
}
