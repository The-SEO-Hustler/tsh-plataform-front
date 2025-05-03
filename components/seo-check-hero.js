"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Search,
} from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useUsage } from "@/lib/usage-context";

function SeoCheckHeroContent() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { trackAnalysis, currentAnalysis, removeContentPlanning, removeLLMTxt, removeAdvancedKeywordAnalysis } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { usage, setUsage } = useUsage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    if (usage?.remaining <= 0) {
      toast.error("You have reached your daily limit. Please try again tomorrow.");
      return;
    }
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
        removeLLMTxt();
        removeAdvancedKeywordAnalysis();
        trackAnalysis(data.docId, url);
        router.push(`/seo-check/result?id=${data.docId}`);
        setIsLoading(false);
        setUsage(prevUsage => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1
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
    }

  }, [])


  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#eaeae9] to-white py-6 md:py-0">
      {/* Hero Section*/}

      <section className="bg-white">

        <Container id="hero">
          <section className="min-h-[calc(100vh-10px)] flex items-center relative">

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - URL Input */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Free <span className="text-primary">SEO Checker Tool</span> That Actually Helps You Grow
                </h1>
                <p className="text-xl ">
                  Is Your Website Invisible to Google? Let's Fix That.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter your website URL"
                      required
                      disabled={isLoading}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 disabled:opacity-100 disabled:bg-gray-300  ${isLoading ? "animate-pulse !bg-primary " : ""}`}
                      disabled={isLoading || usage?.remaining <= 0 || usage === null}
                    >
                      {isLoading ? "Starting Analysis..." : "Analyze"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  {formError && <p className="text-red-500">{formError}</p>}
                </form>
                <div className="flex gap-2 flex-col">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="min-h-5 min-w-5 text-green-700" />
                    <span>No registration required. Free, instant results.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="min-h-5 min-w-5 text-gray-500" />
                    <span className="text-xs text-gray-500">This site is protected by reCAPTCHA and the Google
                      <a href="https://policies.google.com/privacy" className="text-primary ml-1  ">Privacy Policy</a> and
                      <a href="https://policies.google.com/terms" className="text-primary ml-1">Terms of Service</a> apply.</span>
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
      </section>
      <section className=" py-16 relative overflow-hidden bg-gray-100 ">

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <p className="text-lg text-black/80 mb-6">
              Think your website's fine because it looks pretty? Think again. Most sites are leaking traffic (and money) due to basic SEO issues that take minutes to fix.
            </p>
            <p className="text-lg text-black/80 mb-10">
              Our free SEO checker doesn't just find problems — it shows you exactly how to fix them and why they matter to your bottom line.
            </p>
            <p className="text-xl font-bold text-primary mb-6">
              No fluff. No BS. Just actionable SEO fixes that actually move the needle.
            </p>


          </div>
        </Container>
      </section>

      {/* Why This SEO Checker Beats Competition */}
      <section className="py-16 bg-white text-black">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-black">
            Why This SEO Checker Beats the Competition
          </h2>
          <p className="text-lg text-black/80 max-w-4xl mx-auto mb-12 text-center">
            Remember when SEO tools were either too complicated or too basic? This one's different:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-3">Zero registration required</h3>
              <p className="text-black/80">Just enter your URL and go</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-3">Comprehensive analysis</h3>
              <p className="text-black/80">30+ critical checks that actually matter</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-3">Plain English explanations</h3>
              <p className="text-black/80">No confusing tech jargon</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg hover:translate-y-[-5px] transition-all">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">4</div>
              <h3 className="text-xl font-bold mb-3">Actionable fixes</h3>
              <p className="text-black/80">Not just what's wrong, but how to fix it</p>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Check Section */}
      <section className="py-16 bg-gray-100 text-black">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What We Check (And Why It Matters to Your Business)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-12">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">Meta Tags & On-Page Basics</h3>
              <p className="text-black/80 mb-6">
                Your website's first impression to Google isn't your fancy design — it's your meta tags. Get these wrong, and you're starting the race with a broken leg.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Title Tag Analysis</p>
                    <p className="text-gray-800">Too long? Too short? Missing keywords? We'll tell you what's hurting your click-through rates.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Meta Description Audit</p>
                    <p className="text-gray-800">The tiny snippet that can double your traffic (or kill it if done poorly).</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">H1-H6 Tag Structure</p>
                    <p className="text-gray-800">The invisible framework that Google uses to understand what your page is about.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">URL Structure Check</p>
                    <p className="text-gray-800">Messy URLs are conversion killers. We'll show you what to clean up.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">Content Quality Assessment</h3>
              <p className="text-black/80 mb-6">
                Content isn't king — the RIGHT content is. Our tool analyzes what's actually on your page:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Keyword Usage Analysis</p>
                    <p className="text-gray-800">Are you targeting the right terms, or wasting space on the wrong ones?</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Content Length Check</p>
                    <p className="text-gray-800">Too thin? Too bloated? We'll tell you how your content stacks up against competitors.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Readability Score</p>
                    <p className="text-gray-800">Is your content actually readable by humans? (Hint: most isn't)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Duplicate Content Detection</p>
                    <p className="text-gray-800">Find the hidden content issues that can tank your rankings overnight.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">Technical SEO Checks</h3>
              <p className="text-black/80 mb-6">
                The invisible stuff that separates SEO winners from losers:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Page Speed Analysis</p>
                    <p className="text-gray-800">Every second of load time costs you 7% in conversions. How much are you losing?</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Mobile Responsiveness</p>
                    <p className="text-gray-800">With Google's mobile-first indexing, this isn't optional anymore.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Broken Link Detection</p>
                    <p className="text-gray-800">Find and fix the broken links that are bleeding your site's authority.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Image Optimization</p>
                    <p className="text-gray-800">Discover if your images are secretly killing your page speed.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">Advanced SEO Factors</h3>
              <p className="text-black/80 mb-6">
                The pro-level stuff most free tools miss:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Schema Markup Validation</p>
                    <p className="text-gray-800">Are you giving Google the extra data it needs to show rich snippets?</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Social Media Tag Analysis</p>
                    <p className="text-gray-800">Make your content look perfect when shared on social media.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">Robots.txt & Sitemap Check</p>
                    <p className="text-gray-800">Ensure Google can properly crawl and index your site.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">✓</span>
                  <div>
                    <p className="font-bold">CDN Usage Detection</p>
                    <p className="text-gray-800">Is your site being served from the fastest possible locations?</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>


      {/* Get Your Free SEO Analysis Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#FFAA00]">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-6">
            Get Your Free SEO Analysis in 60 Seconds
          </h2>
          <p className="text-lg text-black/90 max-w-3xl mx-auto mb-8">
            Stop guessing what's wrong with your site. Our SEO checker gives you a clear roadmap to better rankings in just one minute:
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10 max-w-3xl mx-auto">
            <div className="bg-black text-white p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-black h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">1</div>
              <p className="text-lg">Enter your website URL below</p>
            </div>
            <div className="bg-black text-white p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-black h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">2</div>
              <p className="text-lg">Wait 60 seconds while we analyze 30+ SEO factors</p>
            </div>
            <div className="bg-black text-white p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-black h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">3</div>
              <p className="text-lg">Get a detailed report with actionable fixes</p>
            </div>
          </div>

          <p className="text-xl font-bold text-black mb-8">
            Your competitors are already using this tool. Are you?
          </p>

          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row">
              <input
                className="bg-white text-black px-4 py-3 rounded-md w-full md:w-3/4 mb-3 md:mb-0 md:mr-3 focus:outline-none focus:ring-2 focus:ring-black"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL"
                required
                disabled={isLoading}
              />
              <button type="submit"
                className={`bg-black hover:bg-black/90 text-white font-bold py-3 px-6 rounded-md transition-all w-full md:w-1/4  cursor-pointer ${isLoading ? "animate-pulse" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze My Site Now"}
              </button>
            </form>
            <p className="text-black/80 text-sm mt-3">No registration, no email required. Just instant SEO insights that actually help.</p>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white text-black">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            After Your Analysis: What The Results Mean
          </h2>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">Your SEO Score: The Truth About Your Site</h3>
            <p className="text-black/80 mb-8">
              Your score isn't just a vanity metric — it's a reality check. Here's what your number means:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-green-500">
                <div className="font-bold text-2xl mb-2 text-green-500">90-100</div>
                <p className="text-black/80">Your site is crushing it. Focus on content and link building.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold text-2xl mb-2 text-blue-500">70-89</div>
                <p className="text-black/80">Good foundation, but fixable issues are holding you back.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-yellow-500">
                <div className="font-bold text-2xl mb-2 text-yellow-500">50-69</div>
                <p className="text-black/80">Serious problems need addressing ASAP. You're leaving money on the table.</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-red-500">
                <div className="font-bold text-2xl mb-2 text-red-500">Below 50</div>
                <p className="text-black/80">Your site needs urgent attention. These issues are killing your business.</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-primary">Understanding Each Check Result</h3>
            <h4 className="text-xl font-bold mb-4">Meta Tags & Content</h4>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-black/80">
                  <span className="font-bold">Green:</span> This aspect is well-optimized. Keep it up!
                </span>
              </div>
              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-black/80">
                  <span className="font-bold">Yellow:</span> Not terrible, but improvements would boost rankings.
                </span>
              </div>
              <div className="flex items-center bg-gray-100 p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-black/80">
                  <span className="font-bold">Red:</span> Critical issue — fix this ASAP! It's actively hurting your visibility.
                </span>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mb-12">
              <p className="text-black/80 mb-4">Every issue we identify comes with:</p>
              <ul className="space-y-2 text-black/80 list-disc list-inside pl-4">
                <li>What's wrong</li>
                <li>Why it matters to your rankings</li>
                <li>How to fix it (in plain English)</li>
                <li>Priority level (what to fix first)</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
      {/* 2025 Section */}
      <section className="py-16 bg-gray-100 text-black">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why These SEO Checks Actually Matter in 2025
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-black/80 mb-10">
              Let's cut the BS — not all SEO factors are created equal. In 2025, these are the ones that actually move the needle:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">Page Speed</h3>
                <p className="text-black/80">
                  Google's Core Web Vitals are now crucial ranking factors. Slow sites don't rank, period.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">Mobile Experience</h3>
                <p className="text-black/80">
                  With mobile-first indexing, your mobile experience IS your SEO experience.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">Content Quality</h3>
                <p className="text-black/80">
                  AI-generated fluff won't cut it. Google rewards depth, expertise and user-focused content.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">Technical Foundation</h3>
                <p className="text-black/80">
                  The unsexy stuff matters more than ever — structured data, clean code, error-free experiences.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Take Action Section */}
      <section className="py-16 bg-white text-black">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Take Action: Your SEO Roadmap
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-black/80 mb-8">
              After your analysis, you'll get a prioritized list of fixes. Start at the top and work down:
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start bg-gray-100 p-6 rounded-lg">
                <div className="bg-red-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Fix critical errors first</h3>
                  <p className="text-black/80">These are actively hurting your rankings</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-100 p-6 rounded-lg">
                <div className="bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Address warnings next</h3>
                  <p className="text-black/80">These are limiting your potential</p>
                </div>
              </div>
              <div className="flex items-start bg-gray-100 p-6 rounded-lg">
                <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Implement suggestions last</h3>
                  <p className="text-black/80">These will take you from good to great</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-black/80 mb-8">
              Remember: SEO isn't a one-time thing. Run this checker monthly to catch new issues and track your progress.
            </p>

            <div className="text-center">
              <p className="text-xl font-bold text-primary mb-8">
                The competitors outranking you are constantly improving their SEO. Are you?
              </p>

              <Link href="#hero" className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-md transition-all">
                Run Another Free Analysis
              </Link>
            </div>
          </div>
        </Container>
      </section>
      {/* FAQ Section */}
      {/* <section className="py-16 bg-gray-100 border-t border-gray-100 text-black">
        <Container>
          <h2 className="text-3xl font-bold mb-12 text-center">
            FAQs About Our SEO Checker
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How accurate is this SEO checker?</h3>
              <p className="text-black/80">
                Unlike many automated tools, ours uses the same checks professional SEOs perform manually. We analyze over 30 critical factors that directly impact your rankings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Will fixing these issues guarantee I rank #1?</h3>
              <p className="text-black/80">
                No tool can promise that (and if they do, they're lying). But fixing these issues removes the barriers preventing your site from ranking to its full potential.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How often should I check my site?</h3>
              <p className="text-black/80">
                At minimum, monthly. After major site updates or Google algorithm changes, run another check immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Is one page enough to check?</h3>
              <p className="text-black/80">
                No. While your homepage is important, check your top landing pages and key conversion pages separately for best results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">What makes this better than other free SEO checkers?</h3>
              <p className="text-black/80">
                Most free tools check 5-10 basic factors. Ours analyzes 30+ technical factors and provides specific, actionable fix instructions—not just vague warnings.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-xl text-black/80 mb-6">
              Try it now. What do you have to lose except poor rankings?
            </p>
            <Link href="#hero" className="bg-primary hover:bg-primary/90 text-black font-bold py-4 px-10 rounded-md text-xl transition-all">
              Check My Site Now
            </Link>
          </div>
        </Container>
      </section> */}

    </main>
  );
}

export default function SeoCheckHero() {
  return (
    <RecaptchaProvider>

      <SeoCheckHeroContent />
    </RecaptchaProvider>
  );
}
