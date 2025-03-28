"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    try {
      // Make the API call to your backend
      // const response = await fetch(`api/analyze`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ url })
      // });

      // const data = await response.json();

      // Store the analysis data in localStorage or state management solution
      // localStorage.setItem('seoAnalysisData', JSON.stringify(data));

      // Navigate to the results page
      router.push(`/seo-audit?url=${encodeURIComponent(url)}`);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      // Handle error (show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen ">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            SEO Analysis Tool
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Get comprehensive insights about your website&apos;s SEO performance
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Analyze
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoading && <LoadingScreen />}
    </main>
  );
}
