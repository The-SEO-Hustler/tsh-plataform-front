"use client";
import React from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, ScanSearch, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useFirebase } from "@/lib/firebase-context";
import { useRouter } from "next/navigation";
import { useUsage } from "@/lib/usage-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPathname } from "@/lib/getpathname";
import HeroTemplate from "../HeroTemplate";

const options = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "russian", label: "Russian" },
  { value: "turkish", label: "Turkish" },
];

function EEATCheckerHero() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [taskLocale, setTaskLocale] = useState("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const {
    currentAnalysis,
    trackAnalysis,
    clearAnalysis,
  } = useFirebase();
  const { usage, setUsage } = useUsage();
  const handleSubmit = async (e) => {
    e.preventDefault();

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
          route: "eeat-checker",
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

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }



    setLoading(true);
    setError(null);
    // setAnalysisData(null);
    try {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("query", query);
      formData.append("userLocation", userLocation);
      formData.append("taskLocale", taskLocale);

      const response = await fetch("/api/eeat-checker", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to evaluate");
      }

      const data = await response.json();
      if (data.success) {
        trackAnalysis({
          type: "evaluation",
          docId: data.docId,
          collection: "evaluations",
          meta: {
            url: url,
            query: query,
            userLocation: userLocation,
            taskLocale: taskLocale,
          },
        });
        router.push(`${getPathname("evaluation")}/result?id=${data.docId}`);
        setUsage((prevUsage) => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1,
        }));
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching content analysis"
      );
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <main className="min-h-screen relative bg-background py-6 md:py-0">
      {/* Hero Section*/}
      <HeroTemplate noBg className="!md:pt-0 !pb-0 !md:pb-0 !mt-0 !pt-0 ">
        <Container>
          <section className="min-h-screen flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              {/* Left Column - Keyword Input */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  E-E-A-T Checker
                </h1>
                <p className="text-xl ">
                  Stop guessing your pages E-E-A-T and get a professional grade
                  Needs Met and Page Quality assessment for free.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.example.com"
                      className="w-full px-4 sm:px-6 py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="url" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Target URL</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="best smartphone 2025"
                      className="w-full px-4 sm:px-6 py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="query" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Query</label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-4 sm:px-6 py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="userLocation" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">User Location</label>
                  </div>
                  <div className="relative">
                    <Select
                      value={taskLocale}
                      onValueChange={setTaskLocale}
                      disabled={loading}
                    >
                      <SelectTrigger
                        size="lg"
                        className="w-full px-4 sm:px-6 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      >
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border border-border rounded-lg shadow-lg">
                        {options.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground rounded-md transition-colors"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <label htmlFor="taskLocale" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Task Locale</label>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full ${loading ? "animate-pulse" : ""
                      } disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
                    disabled={loading || usage?.remaining <= 0 || usage === null}
                  >
                    {loading ? "Analyzing..." : "Evaluate Content"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {/* Right Column - Feature Preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl -z-10" />
                <div className="bg-card p-8 rounded-2xl shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ScanSearch className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">E-E-A-T Checker</h3>
                        <p className="text-sm text-muted-foreground">
                          Professional grade E-E-A-T Assessment Tool
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Needs Met</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          Excellent
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Page Quality</span>
                        <span className="text-sm font-medium text-yellow-700 dark:text-yellow-500">
                          Needs Improvement
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Technical Assessment</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                          High
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
    </main>
  );
}

export default EEATCheckerHero;
