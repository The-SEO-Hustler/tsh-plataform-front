import React from 'react'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFirebase } from '@/lib/firebase-context'
import { useRouter } from 'next/navigation'


function ContentPlanningHero() {

  const [keyword, setKeyword] = useState("");
  const [contentType, setContentType] = useState("blog_post");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { trackContentPlanning, currentContentPlanning, removeAnalysis } = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        trackContentPlanning(data.docId, keyword);
        router.push(`/content-planning?id=${data.docId}`);
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
                Content <span className="text-primary">Planning</span>
              </h1>
              <p className="text-xl ">
                Plan your content strategy with detailed insights and recommendations.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
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
                </div>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="blog_post">Blog Post</option>
                    <option value="product_page">Product Page</option>
                    <option value="service_page">Service Page</option>
                    <option value="landing_page">Landing Page</option>
                    <option value="comparison_page">Comparison Page</option>
                    <option value="guide">Complete Guide</option>
                    <option value="list_post">List Post</option>
                    <option value="tutorial">Tutorial/How-To</option>
                    <option value="faq_page">FAQ Page</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className={`w-full ${loading ? "animate-pulse" : ""}`}
                  disabled={loading}
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
                      <h3 className="font-semibold">Content Insights</h3>
                      <p className="text-sm text-gray-500">
                        Detailed analysis of content strategy
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content Quality</span>
                      <span className="text-sm font-medium text-green-700">
                        Excellent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SEO Optimization</span>
                      <span className="text-sm font-medium text-yellow-700">
                        Needs Improvement
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement</span>
                      <span className="text-sm font-medium text-green-700">
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
    </main>
  )
}

export default ContentPlanningHero;