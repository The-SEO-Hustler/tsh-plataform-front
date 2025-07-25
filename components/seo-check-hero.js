"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import RecaptchaProvider from "@/components/RecaptchaProvider";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useUsage } from "@/lib/usage-context";
import { getPathname } from "@/lib/getpathname";
import HeroTemplate from "./HeroTemplate";
import CardSwap, { Card } from "./CardSwap";
import Image from "next/image";
import RotatingText from "./RotatingText";
import { useTheme } from "next-themes";
import Stepper, { Step } from './Stepper';
import SpotlightCard from './SpotlighCard';

function SeoCheckHeroContent() {
  const { resolvedTheme } = useTheme();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const router = useRouter();
  const {
    trackAnalysis,
    currentAnalysis,
  } = useFirebase();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { usage, setUsage } = useUsage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
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
      const response = await fetch("/api/seo-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, token }),
      });

      const data = await response.json();

      if (data.success) {
        trackAnalysis({
          type: "seo-check",
          docId: data.docId,
          collection: "seoAnalyses",
          meta: {
            url: url,
          },
        });
        router.push(`${getPathname("seo-check")}/result?id=${data.docId}`);
        setIsLoading(false);
        setUsage((prevUsage) => ({
          ...prevUsage,
          remaining: prevUsage.remaining - 1,
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
    };
  }, []);

  return (
    <main className="min-h-screen relative  py-6 md:py-0">
      {/* Hero Section*/}

      <section className="bg-background">
        <HeroTemplate noBg className="!md:pt-0 !pb-0 !md:pb-0 !mt-0 !pt-0 ">
          <Container id="hero">
            <section className="min-h-[calc(100vh-10px)] flex items-center relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - URL Input */}
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Free <span className="text-primary">SEO Checker Tool</span>{" "}
                    <RotatingText
                      texts={['That Actually Helps You Grow', 'That Boosts Your Google Rankings', 'That Unlocks Your SEO Potential', 'That Drives Real Traffic Growth']}
                      // mainClassName="px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                      staggerFrom={"first"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{ type: "spring", damping: 30, stiffness: 400 }}
                      rotationInterval={3500}
                    />
                  </h1>
                  <p className="text-xl text-foreground">
                    Is Your Website Invisible to Google? Let&apos;s Fix That.
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
                        className="w-full px-4 sm:px-6 sm:pr-[160px] pr-[60px] py-4 text-lg border-2 border-gray-300 dark:border-foreground/80 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-transparent text-foreground placeholder:text-foreground/50"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className={`absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 disabled:opacity-100 disabled:bg-gray-300 dark:disabled:bg-foreground/80 ${isLoading ? "animate-pulse !bg-primary " : ""
                          }`}
                        disabled={
                          isLoading || usage?.remaining <= 0 || usage === null
                        }
                      >
                        <span className="sm:block hidden">
                          {isLoading ? "Starting Analysis..." : "Analyze"}
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <label htmlFor="url" className="text-xs text-foreground/80 top-0 left-2 bg-background px-2 py-1 absolute translate-y-[-50%]">Target URL</label>
                    </div>
                    {formError && <p className="text-red-500">{formError}</p>}
                  </form>
                  <div className="flex gap-2 flex-col">
                    <div className="flex items-center gap-4 text-foreground">
                      <CheckCircle2 className="min-h-5 min-w-5 text-green-700 dark:text-green-400" />
                      <span>
                        No registration required. Free, instant results.
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="min-h-5 min-w-5 text-foreground" />
                      <span className="text-xs text-foreground">
                        This site is protected by reCAPTCHA and the Google
                        <a
                          href="https://policies.google.com/privacy"
                          className="text-primary ml-1  "
                        >
                          Privacy Policy
                        </a>{" "}
                        and
                        <a
                          href="https://policies.google.com/terms"
                          className="text-primary ml-1"
                        >
                          Terms of Service
                        </a>{" "}
                        apply.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Feature Preview */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl -z-10" />
                  {/* <div className="bg-card p-8 rounded-2xl shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Search className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">SEO Score</h3>
                          <p className="text-sm text-foreground/80">
                            Overall performance rating
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Meta Tags</span>
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            Optimized
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Content Quality</span>
                          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                            Needs Improvement
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Mobile Responsiveness</span>
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            Excellent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="md:h-[334px] h-[200px] relative">
                    {mounted && (resolvedTheme === "light" || resolvedTheme === "dark") ? (
                      <CardSwap
                        cardDistance={60}
                        verticalDistance={70}
                        delay={5000}
                        width={600}
                        height={334}
                        pauseOnHover={false}
                      >
                        <Card>
                          <Image src={resolvedTheme === "dark" ? "/screenshots/seo-check-screenshot.webp" : "/screenshots/seo-check-screenshot-light.webp"} alt="SEO Check 1" className="object-cover rounded-xl" fill sizes="600px" />
                        </Card>
                        <Card>
                          <Image src={resolvedTheme === "dark" ? "/screenshots/loading.webp" : "/screenshots/loading-light.webp"} alt="SEO Check 2" className="object-cover rounded-xl" fill sizes="600px" />
                        </Card>
                        <Card>
                          <Image src={resolvedTheme === "dark" ? "/screenshots/explanation.webp" : "/screenshots/explanation-light.webp"} alt="SEO Check 3" className="object-cover rounded-xl" fill sizes="600px" />
                        </Card>
                      </CardSwap>
                    ) : (
                      <div className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55] " style={{ width: 600, height: 334 }}>
                        {/* 3 stacked loading cards, diagonally offset */}
                        <div className="absolute top-1/2 left-1/2 w-[600px] h-[334px] rounded-xl border border-foreground bg-card animate-pulse " style={{ transform: 'translate(-50%, -50%) skewY(6deg)', zIndex: 3 }} />
                        <div className="absolute top-1/2 left-1/2 w-[600px] h-[334px] rounded-xl border border-foreground bg-card animate-pulse" style={{ transform: 'translate(calc(-50% + 60px), calc(-50% - 70px)) skewY(6deg)', zIndex: 2 }} />
                        <div className="absolute top-1/2 left-1/2 w-[600px] h-[334px] rounded-xl border border-foreground bg-card animate-pulse" style={{ transform: 'translate(calc(-50% + 120px), calc(-50% - 140px)) skewY(6deg)', zIndex: 1 }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </HeroTemplate>
      </section>
      <section className=" py-16 relative overflow-hidden bg-gray-100  dark:bg-background/90 ">
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center text-foreground/80">
            <p className="text-lg mb-6">
              Think your website&apos;s fine because it looks pretty? Think again.
              Most sites are leaking traffic (and money) due to basic SEO issues
              that take minutes to fix.
            </p>
            <p className="text-lg mb-10">
              Our free SEO checker doesn&apos;t just find problems — it shows you
              exactly how to fix them and why they matter to your bottom line.
            </p>
            <p className="text-xl font-bold text-primary mb-6">
              No fluff. No BS. Just actionable SEO fixes that actually move the
              needle.
            </p>
          </div>
        </Container>
      </section>

      {/* Why This SEO Checker Beats Competition */}
      <section className="py-16 bg-background text-foreground">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
            Why This SEO Checker Beats the Competition
          </h2>
          <p className="text-lg text-foreground/80 max-w-4xl mx-auto mb-12 text-center">
            Remember when SEO tools were either too complicated or too basic?
            This one&apos;s different:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <SpotlightCard className=" p-6 rounded-lg hover:translate-y-[-5px] transition-all" spotlightColor="#ffcc0050">

              <div>
                <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Zero registration required
                </h3>
                <p className="text-foreground/80">Just enter your URL and go</p>
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-card p-6 rounded-lg hover:translate-y-[-5px] transition-all" spotlightColor="#ffcc0050">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Comprehensive analysis</h3>
              <p className="text-foreground/80">
                30+ critical checks that actually matter
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-card p-6 rounded-lg hover:translate-y-[-5px] transition-all" spotlightColor="#ffcc0050">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">
                Plain English explanations
              </h3>
              <p className="text-foreground/80">No confusing tech jargon</p>
            </SpotlightCard>

            <SpotlightCard className="bg-card p-6 rounded-lg hover:translate-y-[-5px] transition-all" spotlightColor="#ffcc0050">
              <div className="bg-primary h-12 w-12 flex items-center justify-center rounded-full text-black font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable fixes</h3>
              <p className="text-foreground/80">
                Not just what&apos;s wrong, but how to fix it
              </p>
            </SpotlightCard>
          </div>
        </Container>
      </section>

      {/* What We Check Section */}
      <section className="py-16 bg-gray-100 dark:bg-background/90 text-foreground">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What We Check (And Why It Matters to Your Business)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-12">
            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Meta Tags & On-Page Basics
              </h3>
              <p className="text-foreground/80 mb-6">
                Your website&apos;s first impression to Google isn&apos;t your fancy
                design — it&apos;s your meta tags. Get these wrong, and you&apos;re
                starting the race with a broken leg.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Title Tag Analysis</p>
                    <p className="text-foreground/80">
                      Too long? Too short? Missing keywords? We&apos;ll tell you
                      what&apos;s hurting your click-through rates.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Meta Description Audit</p>
                    <p className="text-foreground/80">
                      The tiny snippet that can double your traffic (or kill it
                      if done poorly).
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">H1-H6 Tag Structure</p>
                    <p className="text-foreground/80">
                      The invisible framework that Google uses to understand
                      what your page is about.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">URL Structure Check</p>
                    <p className="text-foreground/80">
                      Messy URLs are conversion killers. We&apos;ll show you what to
                      clean up.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Content Quality Assessment
              </h3>
              <p className="text-foreground/80 mb-6">
                Content isn&apos;t king — the RIGHT content is. Our tool analyzes
                what&apos;s actually on your page:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Keyword Usage Analysis</p>
                    <p className="text-foreground/80">
                      Are you targeting the right terms, or wasting space on the
                      wrong ones?
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Content Length Check</p>
                    <p className="text-foreground/80">
                      Too thin? Too bloated? We&apos;ll tell you how your content
                      stacks up against competitors.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Readability Score</p>
                    <p className="text-foreground/80">
                      Is your content actually readable by humans? (Hint: most
                      isn&apos;t)
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Duplicate Content Detection</p>
                    <p className="text-foreground/80">
                      Find the hidden content issues that can tank your rankings
                      overnight.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Technical SEO Checks
              </h3>
              <p className="text-foreground/80 mb-6">
                The invisible stuff that separates SEO winners from losers:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Page Speed Analysis</p>
                    <p className="text-foreground/80">
                      Every second of load time costs you 7% in conversions. How
                      much are you losing?
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Mobile Responsiveness</p>
                    <p className="text-foreground/80">
                      With Google&apos;s mobile-first indexing, this isn&apos;t optional
                      anymore.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Broken Link Detection</p>
                    <p className="text-foreground/80">
                      Find and fix the broken links that are bleeding your
                      site&apos;s authority.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Image Optimization</p>
                    <p className="text-foreground/80">
                      Discover if your images are secretly killing your page
                      speed.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Advanced SEO Factors
              </h3>
              <p className="text-foreground/80 mb-6">
                The pro-level stuff most free tools miss:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Schema Markup Validation</p>
                    <p className="text-foreground/80">
                      Are you giving Google the extra data it needs to show rich
                      snippets?
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Social Media Tag Analysis</p>
                    <p className="text-foreground/80">
                      Make your content look perfect when shared on social
                      media.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Robots.txt & Sitemap Check</p>
                    <p className="text-foreground/80">
                      Ensure Google can properly crawl and index your site.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-black p-1 rounded-full mr-2 mt-1 min-w-8 min-h-8 flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">CDN Usage Detection</p>
                    <p className="text-foreground/80">
                      Is your site being served from the fastest possible
                      locations?
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Get Your Free SEO Analysis Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-6">
            Get Your Free SEO Analysis in 60 Seconds
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Stop guessing what&apos;s wrong with your site. Our SEO checker gives you
            a clear roadmap to better rankings in just one minute:
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10 max-w-3xl mx-auto">
            <div className="bg-card text-foreground p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                1
              </div>
              <p className="text-lg">Enter your website URL below</p>
            </div>
            <div className="bg-card text-foreground p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                2
              </div>
              <p className="text-lg">
                Wait 60 seconds while we analyze 30+ SEO factors
              </p>
            </div>
            <div className="bg-card text-foreground p-6 rounded-lg flex items-center text-left w-full md:w-auto">
              <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0">
                3
              </div>
              <p className="text-lg">
                Get a detailed report with actionable fixes
              </p>
            </div>
          </div>

          <p className="text-xl font-bold text-primary-foreground mb-8">
            Your competitors are already using this tool. Are you?
          </p>

          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter your webite URL"
                  required
                  disabled={isLoading}
                  className="w-full px-6 py-4 text-lg border-2 border-primary-foreground rounded-lg focus:ring-2 focus:ring-primary-foreground focus:border-transparent transition-all duration-200 text-primary-foreground bg-transparent placeholder:text-primary-foreground/50"
                />
                <Button
                  type="submit"
                  size="lg"
                  className={`absolute bg-primary-foreground text-white cursor-pointer right-3 top-1/2 -translate-y-1/2 disabled:opacity-100 disabled:bg-gray-300  ${isLoading ? "animate-pulse !bg-primary " : ""
                    }`}
                  disabled={
                    isLoading || usage?.remaining <= 0 || usage === null
                  }
                >
                  {isLoading ? "Starting Analysis..." : "Analyze"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

              </div>
              {formError && <p className="text-red-500">{formError}</p>}
            </form>
            <p className="text-primary-foreground text-sm mt-3">
              No registration, no email required. Just instant SEO insights that
              actually help.
            </p>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-background text-foreground">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            After Your Analysis: What The Results Mean
          </h2>

          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold mb-6 text-primary">
              Your SEO Score: The Truth About Your Site
            </h3>
            <p className="text-foreground/80 mb-8">
              Your score isn&apos;t just a vanity metric — it&apos;s a reality check.
              Here&apos;s what your number means:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg border-l-4 border-green-500">
                <div className="font-bold text-2xl mb-2 text-green-500">
                  90-100
                </div>
                <p className="text-foreground/80">
                  Your site is crushing it. Focus on content and link building.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border-l-4 border-blue-500">
                <div className="font-bold text-2xl mb-2 text-blue-500">
                  70-89
                </div>
                <p className="text-foreground/80">
                  Good foundation, but fixable issues are holding you back.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border-l-4 border-yellow-500">
                <div className="font-bold text-2xl mb-2 text-yellow-500">
                  50-69
                </div>
                <p className="text-foreground/80">
                  Serious problems need addressing ASAP. You&apos;re leaving money on
                  the table.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border-l-4 border-red-500">
                <div className="font-bold text-2xl mb-2 text-red-500">
                  Below 50
                </div>
                <p className="text-foreground/80">
                  Your site needs urgent attention. These issues are killing
                  your business.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-primary">
              Understanding Each Check Result
            </h3>
            <h4 className="text-xl font-bold mb-4">Meta Tags & Content</h4>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center bg-card p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-foreground/80">
                  <span className="font-bold">Green:</span> This aspect is
                  well-optimized. Keep it up!
                </span>
              </div>
              <div className="flex items-center bg-card p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-foreground/80">
                  <span className="font-bold">Yellow:</span> Not terrible, but
                  improvements would boost rankings.
                </span>
              </div>
              <div className="flex items-center bg-card p-3 rounded-md">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-foreground/80">
                  <span className="font-bold">Red:</span> Critical issue — fix
                  this ASAP! It&apos;s actively hurting your visibility.
                </span>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg mb-12">
              <p className="text-foreground/80 mb-4">
                Every issue we identify comes with:
              </p>
              <ul className="space-y-2 text-foreground/80 list-disc list-inside pl-4">
                <li>What&apos;s wrong</li>
                <li>Why it matters to your rankings</li>
                <li>How to fix it (in plain English)</li>
                <li>Priority level (what to fix first)</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
      {/* 2025 Section */}
      <section className="py-16 bg-background text-foreground">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Why These SEO Checks Actually Matter in 2025
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 mb-10">
              Let&apos;s cut the BS — not all SEO factors are created equal. In 2025,
              these are the ones that actually move the needle:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Page Speed
                </h3>
                <p className="text-foreground/80">
                  Google&apos;s Core Web Vitals are now crucial ranking factors. Slow
                  sites don&apos;t rank, period.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Mobile Experience
                </h3>
                <p className="text-foreground/80">
                  With mobile-first indexing, your mobile experience IS your SEO
                  experience.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Content Quality
                </h3>
                <p className="text-foreground/80">
                  AI-generated fluff won&apos;t cut it. Google rewards depth,
                  expertise and user-focused content.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Technical Foundation
                </h3>
                <p className="text-foreground/80">
                  The unsexy stuff matters more than ever — structured data,
                  clean code, error-free experiences.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* Take Action Section */}
      <section className="py-16 bg-background text-foreground">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Take Action: Your SEO Roadmap
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-foreground/80 mb-8">
              After your analysis, you&apos;ll get a prioritized list of fixes. Start
              at the top and work down:
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start bg-card p-6 rounded-lg">
                <div className="bg-red-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Fix critical errors first
                  </h3>
                  <p className="text-foreground/80">
                    These are actively hurting your rankings
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-card p-6 rounded-lg">
                <div className="bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Address warnings next
                  </h3>
                  <p className="text-foreground/80">
                    These are limiting your potential
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-card p-6 rounded-lg">
                <div className="bg-blue-500 h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 mt-1 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Implement suggestions last
                  </h3>
                  <p className="text-foreground/80">
                    These will take you from good to great
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-foreground/80 mb-8">
              Remember: SEO isn&apos;t a one-time thing. Run this checker monthly to
              catch new issues and track your progress.
            </p>

            <div className="text-center">
              <p className="text-xl font-bold text-primary mb-8">
                The competitors outranking you are constantly improving their
                SEO. Are you?
              </p>

              <Link
                href="#hero"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-md transition-all"
              >
                Run Another Free Analysis
              </Link>
            </div>
          </div>
        </Container>
      </section>

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
