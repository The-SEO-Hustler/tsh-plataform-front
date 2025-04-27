'use client'
import React from 'react'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFirebase } from '@/lib/firebase-context'
import { useRouter } from 'next/navigation'
import { useUsage } from "@/lib/usage-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function LLMTxtHero() {

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { trackLLMTxt, currentLLMTxt, removeLLMTxt } = useFirebase();
  const { usage, setUsage } = useUsage();
  const [mode, setMode] = useState('simple');
  const [advancedText, setAdvancedText] = useState('');

  const handleTabChange = (selectedMode) => {
    setMode(selectedMode);
  };

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
        router.push(`/llmstxt/result?id=${data.docId}`);
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
    <main className="min-h-screen relative bg-gradient-to-br from-[#eaeae9] to-white py-6 md:py-0">
      {/* Hero Section*/}

      <Container>
        <section className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Keyword Input */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                LLM.<span className="text-primary">TXT</span>
              </h1>
              <p className="text-xl ">
                Generate consolidated text files from websites for LLM training and inference.
              </p>
              <Tabs value={mode} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="simple" className="cursor-pointer">Simple</TabsTrigger>
                  <TabsTrigger value="advanced" className="cursor-not-allowed" disabled>Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="relative">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a URL..."
                        className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full ${loading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
                      disabled={loading || usage?.remaining <= 0 || usage === null}
                    >
                      {loading ? "Initializing..." : "Generate Text"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="advanced">
                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="relative">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a URL..."
                        className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="relative">
                      <textarea
                        value={advancedText}
                        onChange={(e) => setAdvancedText(e.target.value)}
                        placeholder="Enter additional text..."
                        className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        rows="4"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full ${loading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300`}
                      disabled={loading || usage?.remaining <= 0 || usage === null}
                    >
                      {loading ? "Analyzing..." : "Generate Text"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
                      <h3 className="font-semibold">Website Analysis</h3>
                      <p className="text-sm text-gray-500">
                        Scrape and analyze web pages using LLMs to provide insights.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Page Scraping</span>
                      <span className="text-sm font-medium text-green-700">
                        Automated
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">LLM Analysis</span>
                      <span className="text-sm font-medium text-blue-700">
                        In-depth
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Insight Delivery</span>
                      <span className="text-sm font-medium text-purple-700">
                        Downloadable TXT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </Container>
      <section className="py-12 bg-[#f0f0f0]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Understanding LLMS Text Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#f9f9f9] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">LLMS.txt (Shortened)</h3>
                <p className="text-gray-700">
                  The condensed version provides a quick overview of how search engines see your site. This representation focuses on the most important content and links.
                </p>
              </div>

              <div className="bg-[#f9f9f9] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">LLMS-Full.txt (Complete)</h3>
                <p className="text-gray-700">
                  The full LLMS text representation contains all the content search engines might index, including headings, links, and body text in a structured format.
                </p>
              </div>
            </div>

            <div className="bg-[#f9f9f9] p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-primary">Why This Matters for SEO</h3>
              <p className="text-gray-700 mb-4">
                This text representation shows how search engines and AI systems might understand your website's content. Analyzing this can help you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Identify content gaps and opportunities</li>
                <li>Ensure your main topics and keywords are clearly represented</li>
                <li>Check if your site structure is being correctly interpreted</li>
                <li>Verify that important content isn't being missed by crawlers</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

export default LLMTxtHero;