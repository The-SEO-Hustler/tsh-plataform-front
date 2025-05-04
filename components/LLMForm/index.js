import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useUsage } from '@/lib/usage-context'
import { useFirebase } from '@/lib/firebase-context'
import { toast } from 'sonner'

function LLMForm() {
  const [url, setUrl] = useState('');
  const [advancedText, setAdvancedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { usage, setUsage } = useUsage();
  const { trackLLMTxt, currentLLMTxt, removeLLMTxt } = useFirebase();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usage?.remaining <= 0) {
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }
    if (currentLLMTxt && (currentLLMTxt?.status !== "completed" && currentLLMTxt?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (
      currentLLMTxt &&
      currentLLMTxt?.status !== "completed" &&
      currentLLMTxt?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    setLoading(true);
    setError(null);
    // setAnalysisData(null);
    console.log('url', url);
    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await fetch("/api/llmstxt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.success) {
        removeLLMTxt();
        trackLLMTxt(data.docId, url);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL..."
            className="w-full px-6 py-4 text-lg border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            size="lg"
            className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 disabled:opacity-100 disabled:bg-gray-300  ${loading ? "animate-pulse !bg-primary !text-primary-foreground" : ""}`}
            disabled={loading || usage?.remaining <= 0 || usage === null}
          >
            {loading ? "Generating Text..." : "Generate Text"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </>
  )
}

export default LLMForm