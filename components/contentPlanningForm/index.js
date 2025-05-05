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
  { value: "blog_post", label: "Blog Post" },
  { value: "product_page", label: "Product Page" },
  { value: "service_page", label: "Service Page" },
  { value: "landing_page", label: "Landing Page" },
  { value: "comparison_page", label: "Comparison Page" },
  { value: "guide", label: "Complete Guide" },
  { value: "list_post", label: "List Post" },
  { value: "tutorial", label: "Tutorial/How-To" },
  { value: "faq_page", label: "FAQ Page" },
]

function ContentPlanningForm() {
  const [keyword, setKeyword] = useState('');
  const [contentType, setContentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { usage, setUsage } = useUsage();
  const { trackContentPlanning, currentContentPlanning, removeLLMTxt, removeAdvancedKeywordAnalysis } = useFirebase();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usage?.remaining <= 0) {
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }
    if (currentContentPlanning && (currentContentPlanning?.status !== "completed" && currentContentPlanning?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    if (!keyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    if (
      currentContentPlanning &&
      currentContentPlanning?.status !== "completed" &&
      currentContentPlanning?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    setLoading(true);
    setError(null);
    // setAnalysisData(null);
    console.log('keyword', keyword, 'contentType', contentType);
    try {
      const formData = new FormData();
      formData.append("keyword", keyword);
      formData.append("content_type", contentType);

      const response = await fetch("/api/content-planning", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.success) {
        removeAnalysis();
        removeLLMTxt();
        removeAdvancedKeywordAnalysis();
        trackContentPlanning(data.docId, keyword);
        setUsage(prevUsage => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1
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
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a keyword..."
            className="w-full px-4 sm:px-6 py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            required
            disabled={loading}
          />
        </div>
        <div className="relative">
          <Select
            value={contentType}
            onValueChange={setContentType}
            disabled={loading}
          >
            <SelectTrigger size="lg" className="w-full px-4 sm:px-6 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
              <SelectValue placeholder="Select content type" />
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
        </div>
        <Button
          type="submit"
          size="lg"
          className={`w-full ${loading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
          disabled={loading || usage?.remaining <= 0 || usage === null}
        >
          {loading ? "Analyzing..." : "Analyze Content Structure"}
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

export default ContentPlanningForm