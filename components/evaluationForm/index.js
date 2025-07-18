'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useUsage } from '@/lib/usage-context'
import { useFirebase } from '@/lib/firebase-context'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

function EvaluationForm() {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [taskLocale, setTaskLocale] = useState('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { usage, setUsage } = useUsage();
  const { trackAnalysis, currentAnalysis } = useFirebase();
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        // router.push(`${getPathname("evaluation")}/result?id=${data.docId}`);
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
    <>
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
    </>
  )
}

export default EvaluationForm