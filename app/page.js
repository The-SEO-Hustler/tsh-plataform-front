"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Search,
  Zap,
  Shield,
} from "lucide-react";
import Container from "@/components/container";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push(`/seo-audit?id=${data.docId}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error starting analysis:", error);
      setIsLoading(false);
      // Show error message to user
    }
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Comprehensive Analysis",
      description:
        "Get detailed insights into your website's SEO performance with our advanced analysis tools.",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Performance Metrics",
      description:
        "Track key SEO metrics and get actionable recommendations to improve your rankings.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Results",
      description:
        "Get instant feedback and analysis of your website's SEO health.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Check",
      description:
        "Ensure your website follows security best practices and is safe for visitors.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Container>
        <section className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - URL Input */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Analyze Your Website&apos;s
                <span className="text-primary"> SEO Performance</span>
              </h1>
              <p className="text-xl ">
                Get comprehensive insights and actionable recommendations to
                improve your website&apos;s search engine rankings.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your website URL"
                    className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Starting Analysis..." : "Analyze"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
                <span>Free analysis - No registration required</span>
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

      {/* Features Section */}
      <section className="py-24 ">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive SEO Analysis Tools
            </h2>
            <p className="text-gray-600">
              Get detailed insights and actionable recommendations to improve
              your website&apos;s search engine rankings.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">
              Three simple steps to improve your website&apos;s SEO
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Enter Your URL</h3>
              <p className="text-gray-600 text-sm">
                Simply paste your website URL and let our tools analyze it
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Analysis</h3>
              <p className="text-gray-600 text-sm">
                Receive comprehensive insights about your website&apos;s SEO
                performance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Improve Rankings</h3>
              <p className="text-gray-600 text-sm">
                Follow our recommendations to enhance your search engine
                rankings
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Improve Your SEO?
            </h2>
            <p className="mb-8">
              Start your free analysis now and get actionable insights within
              minutes.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Analyze Your Website
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
