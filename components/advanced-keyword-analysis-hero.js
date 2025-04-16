import React from 'react'
import Container from '@/components/container'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { Search } from 'lucide-react'
import { TriangleAlert } from 'lucide-react'
import { useFirebase } from "@/lib/firebase-context";
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react'

function AdvancedKeywordAnalysisHero() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const router = useRouter();
  const { currentAdvancedKeywordAnalysis, trackAdvancedKeywordAnalysis, removeAdvancedKeywordAnalysis } = useFirebase();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentAdvancedKeywordAnalysis && (currentAdvancedKeywordAnalysis?.status !== "completed" && currentAdvancedKeywordAnalysis?.status !== "failed")) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    if (!keyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    if (
      currentAdvancedKeywordAnalysis &&
      currentAdvancedKeywordAnalysis?.status !== "completed" &&
      currentAdvancedKeywordAnalysis?.status !== "failed"
    ) {
      toast.error("Please wait for the previous analysis to complete.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const formData = new FormData();
      formData.append("keyword", keyword);

      const response = await fetch("/api/advanced-keyword-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch content analysis");
      }

      const data = await response.json();
      if (data.success) {
        removeAdvancedKeywordAnalysis();
        trackAdvancedKeywordAnalysis(data.docId, keyword);
        router.push(`/advanced-keyword-analysis?id=${data.docId}`);
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
            {/* Left Column - Keyword Input */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Advanced <span className="text-primary">Keyword Analysis</span>
              </h1>
              <p className="text-xl ">
                Get detailed insights and recommendations to optimize your keyword strategy.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter a keyword..."
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 ${loading ? "animate-pulse" : ""}`}
                    disabled={loading}
                  >
                    {loading ? "Analyzing..." : "Analyze Keyword"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Keyword Insights</h3>
                      <p className="text-sm text-gray-500">
                        Detailed analysis of keyword performance
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Search Volume</span>
                      <span className="text-sm font-medium text-green-700">
                        High
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Competition</span>
                      <span className="text-sm font-medium text-yellow-700">
                        Moderate
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Relevance</span>
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
  )
}

export default AdvancedKeywordAnalysisHero;
