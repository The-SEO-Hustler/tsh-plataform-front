'use client'
import React from 'react'
import Container from '@/components/container'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileCode } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFirebase } from '@/lib/firebase-context'
import { useRouter } from 'next/navigation'
import { useUsage } from "@/lib/usage-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';

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
        router.push(`/llms-txt-generator/result?id=${data.docId}`);
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
    <main className="min-h-screen relative bg-gradient-to-br bg-background py-6 md:py-0">
      {/* Hero Section*/}

      <Container>
        <section className="min-h-screen flex items-center pb-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Keyword Input */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Free <span className="text-primary">LLMs.txt</span> Generator
              </h1>
              <p className="text-xl text-foreground/80">
                Create optimized LLMs.txt files in minutes, not hours. Control how AI sees and represents your business.
              </p>
              <Tabs value={mode} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="simple" className="cursor-pointer">Simple</TabsTrigger>
                  <TabsTrigger value="advanced" className="cursor-not-allowed" disabled>Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10" id="#tool">
                    <div className="relative">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a URL..."
                        className="w-full px-6 py-4 text-lg border-2 border-foreground/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full ${loading ? "animate-pulse" : ""} disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-foreground/10`}
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
              <div className="bg-card p-8 rounded-2xl shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileCode className="w-6 h-6 text-primary" />
                    </div>
                    <div>

                      <h3 className="font-semibold text-lg">Generate a LLMs.txt file for your website</h3>
                      <p className="text-sm text-foreground/80">
                        Just input your homepage URL and we will do the rest, this is how it works:
                      </p>
                    </div>
                  </div>

                  <ul className="list-disc space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Website Crawling and Extraction</span>
                      <span className="text-sm font-medium text-green-700 dark:text-green-500">~3 minutes</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Content Analysis and Understanding</span>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-500">~4 minutes</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Downloadable LLMs.txt file ready</span>
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-500">7 to 10 minutes</span>
                    </li>
                  </ul>
                  <p className="text-sm text-foreground/80 italic">
                    *Don't worry, you can browse around our website and we will notify you
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </Container>


      {/* What is LLMs.txt Section */}
      <section className="py-16 dark:bg-black bg-card border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What is LLMs.txt?
          </h2>
          <div className="max-w-4xl mx-auto dark:bg-card bg-background p-8 rounded-lg">
            <p className="text-xl text-foreground/80 mb-6">
              Think of LLMs.txt as your website's AI tour guide.
            </p>
            <p className="text-lg text-foreground/80 mb-6">
              It's a specialized file that tells AI exactly what your site is about and where to find your most valuable content. Without it, AI systems are left guessing — crawling through navigation menus and sidebars instead of focusing on what matters.
            </p>
            <p className="text-lg text-foreground/80 mb-6">
              In a world where more people are using AI search tools like ChatGPT and Claude to find information, this file is becoming your new digital front door.
            </p>
            <Link href="/blog/what-is-llms-txt" className="text-primary hover:underline inline-flex items-center">
              Learn everything about LLMs.txt in our comprehensive guide →
            </Link>
          </div>
        </Container>
      </section>

      {/* Why Your Website Needs LLMs.txt Now */}
      <section className="py-16 bg-background border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why Your Website Needs LLMs.txt Now
          </h2>
          <p className="text-lg text-foreground/80 max-w-4xl mx-auto mb-12 text-center">
            Right now, AI systems are forming first impressions of your business without your input. That's like letting strangers describe your products to potential customers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-start">
                <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mr-3 mt-1">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Control your narrative</h3>
                  <p className="text-foreground/80">Guide AI to your latest pricing, not a blog post from 2019</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-start">
                <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mr-3 mt-1">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Boost AI visibility</h3>
                  <p className="text-foreground/80">Early adopters will have an edge as AI search grows (remember early SEO winners?)</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-start">
                <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mr-3 mt-1">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Prevent misrepresentation</h3>
                  <p className="text-foreground/80">Stop AI from quoting outdated info or missing your key points</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-start">
                <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mr-3 mt-1">✓</span>
                <div>
                  <h3 className="text-xl font-bold mb-2">Future-proof your site</h3>
                  <p className="text-foreground/80">AI search isn't just coming, it's already here</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How Our Generator Works */}
      <section className="py-16 dark:bg-black bg-background border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How Our Generator Works
          </h2>
          <p className="text-lg text-foreground/80 max-w-4xl mx-auto mb-12 text-center">
            We don't just scrape your site and call it a day. Our multi-step process is designed to truly understand what your website offers:
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg">
              <ol className="space-y-6">
                <li className="flex">
                  <div className="bg-primary text-black min-h-8 min-w-8 h-8 w-8 flex items-center justify-center rounded-full font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold">Deep crawling</h3>
                    <p className="text-foreground/80">We analyze your homepage and key pages</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-black min-h-8 min-w-8 h-8 w-8 flex items-center justify-center rounded-full font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold">Markdown conversion</h3>
                    <p className="text-foreground/80">Content is transformed for optimal AI ingestion</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-black min-h-8 min-w-8 h-8 w-8 flex items-center justify-center rounded-full font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold">NLP analysis</h3>
                    <p className="text-foreground/80">Our proprietary system identifies:</p>
                    <ul className="list-disc list-inside pl-4 text-foreground/80 mt-2">
                      <li>Core concepts and semantics</li>
                      <li>Entity relationships</li>
                      <li>User intent on each page</li>
                      <li>Content hierarchy and importance</li>
                    </ul>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-black min-h-8 min-w-8 h-8 w-8 flex items-center justify-center rounded-full font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-xl font-bold">Semantic prioritization</h3>
                    <p className="text-foreground/80">We highlight what makes your site unique</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary text-black min-h-8 min-w-8 h-8 w-8 flex items-center justify-center rounded-full font-bold mr-4 flex-shrink-0">5</div>
                  <div>
                    <h3 className="text-xl font-bold">Optimized output</h3>
                    <p className="text-foreground/80">Get a perfectly formatted LLMs.txt file ready to implement</p>
                  </div>
                </li>
              </ol>
              <p className="text-foreground/80 mt-6 italic">
                It's trying to do what it takes many SEOs hours to accomplish manually.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Two Simple Ways */}
      <section className="py-16 bg-background border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Two Simple Ways to Generate Your File
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg border-2 border-transparent hover:border-primary transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Basic Mode</h3>
                <p className="text-foreground mb-6">
                  Just input your homepage URL and let us do the heavy lifting. Perfect if you're not sure which pages matter most.
                </p>
              </div>
              <Button href="/llms-txt-generator#tool" className="w-full bg-primary hover:bg-primary text-black py-3 rounded-md transition-all">
                Use Basic Mode
              </Button>
            </div>

            <div className="relative bg-card p-8 rounded-lg border-2 border-transparent hover:border-primary transition-all flex flex-col justify-between opacity-80 cursor-not-allowed">
              {/* Coming Soon Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                Coming Soon
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Advanced Mode</h3>
                <p className="text-foreground/80 mb-6">
                  Input your homepage plus up to 10 key pages you want to prioritize. Ideal for larger sites or when you have specific pages you want AI to focus on.
                </p>
              </div>
              {/* Button disabled or styled */}
              <Button
                href="#"
                disabled
                className="w-full bg-primary/50 text-black font-bold py-3 rounded-md transition-all cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </div>

          </div>
        </Container>
      </section>

      {/* Why Our Generator Beats the Competition */}
      <section className="py-16 dark:bg-black bg-card border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Why Our Generator Beats the Competition
          </h2>
          <p className="text-lg text-foreground/80 max-w-4xl mx-auto mb-12 text-center">
            Not all LLMs.txt generators are created equal. Here's what makes ours different:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <h3 className="text-xl font-bold mb-3">Multi-layered analysis</h3>
              <p className="text-foreground/80">We don't just scrape; we understand</p>
            </div>

            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <h3 className="text-xl font-bold mb-3">Semantic focus</h3>
              <p className="text-foreground/80">Highlights concepts and entities, not just URLs</p>
            </div>

            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <h3 className="text-xl font-bold mb-3">Proper prioritization</h3>
              <p className="text-foreground/80">Surfaces what makes your business unique</p>
            </div>

            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <h3 className="text-xl font-bold mb-3">Structured output</h3>
              <p className="text-foreground/80">Organized by importance and relevance</p>
            </div>

            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <h3 className="text-xl font-bold mb-3">Future-proof format</h3>
              <p className="text-foreground/80">Ready for evolving AI standards</p>
            </div>

            <div className="dark:bg-card bg-background p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <p className="text-foreground/80 italic">
                    While basic generators just list your pages, we're creating a semantic roadmap of your business that AI can actually understand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-background border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How to Use Our Generator (It's Dead Simple)
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card  p-8 rounded-lg">
              <ol className="space-y-6">
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold">Choose your mode</h3>
                    <p className="text-foreground/80">Basic or Advanced</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold">Enter your URL(s)</h3>
                    <p className="text-foreground/80">Just your homepage or add specific key pages</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold">Initiate generation</h3>
                    <p className="text-foreground/80">Click the button and we'll start working</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="text-xl font-bold">Wait briefly</h3>
                    <p className="text-foreground/80">The process takes up to 10 minutes (feel free to browse elsewhere; we'll notify you)</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">5</div>
                  <div>
                    <h3 className="text-xl font-bold">Review & download</h3>
                    <p className="text-foreground/80">Get your custom LLMs.txt file</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full font-bold mr-4 flex-shrink-0">6</div>
                  <div>
                    <h3 className="text-xl font-bold">Implement</h3>
                    <p className="text-foreground/80">Upload to your website's root directory</p>
                  </div>
                </li>
              </ol>
              <p className="text-foreground/80 mt-6 text-center font-bold">
                That's it! Your website is now optimized for the next generation of AI search.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What You'll Get */}
      <section className="py-16 bg-background border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            What You'll Get
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-card p-6 rounded-lg">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <p className="text-lg text-foreground/80">A perfectly formatted LLMs.txt file</p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <p className="text-lg text-foreground/80">Optimized hierarchy of your most important content</p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <p className="text-lg text-foreground/80">Clear descriptions that help AI understand your offerings</p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <p className="text-lg text-foreground/80">Proper markdown syntax following emerging standards</p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <span className="bg-primary min-h-8 min-w-8 h-8 w-8 flex items-center justify-center text-black p-1 rounded-full mb-4">✓</span>
              <p className="text-lg text-foreground/80">A competitive edge in AI-powered search and discovery</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Still on the Fence? */}
      <section className="py-16 dark:bg-black bg-card border-t border-foreground/10">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Still on the Fence?
          </h2>

          <div className="max-w-4xl bg-background mx-auto p-8 rounded-lg">
            <p className="text-lg text-foreground/80 mb-6">
              While LLMs.txt isn't an official standard yet, it's rapidly gaining adoption. The cost to implement is minimal, but the potential upside is huge.
            </p>
            <p className="text-lg text-foreground/80 mb-6">
              Remember when "mobile-friendly" websites were optional? The businesses that moved first won big. Don't be the last one to this party.
            </p>
          </div>
        </Container>
      </section>

      {/* Generate Now CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary">
        <Container>
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-6 text-center">
            Generate Your LLMs.txt File Now
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Process takes approximately 10 minutes. You can continue browsing while we work.
          </p>

          <div className="flex justify-center">
            <Button href="/llms-txt-generator#tool" size="lg" className="bg-primary-foreground text-white cursor-pointer hover:bg-primary-foreground/80  font-bold py-4 px-10 rounded-md text-xl transition-all">
              Generate My LLMs.txt File
            </Button>
          </div>
        </Container>
      </section>
    </main>
  )
}

export default LLMTxtHero;