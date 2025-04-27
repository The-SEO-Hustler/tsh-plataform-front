"use client";

import React, { useState, useEffect, Suspense } from "react";
import { DownloadCloud, Copy, FileText, FileCode } from 'lucide-react';
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreenLLM from "@/components/LoadingScreenLLM";
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function LLMTxtResult() {
  const [url, setUrl] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [viewMode, setViewMode] = useState('markdown');
  const [activeTab, setActiveTab] = useState('llmtxt');

  const { trackLLMTxt, currentLLMTxt } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentLLMTxt ? currentLLMTxt.status : "initializing"
  );

  // For downloading the text
  const downloadTxt = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Render text content based on view mode
  const renderContent = (text) => {
    if (viewMode === 'text') {
      return (
        <pre className="bg-[#fff] p-6 rounded-md text-black whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[600px]">
          {text}
        </pre>
      );
    } else {
      return (
        <div className="bg-[#fff] p-6 rounded-md text-black overflow-auto max-h-[600px]">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-2xl font-bold mb-4 text-black" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-xl font-bold mb-3 text-black" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-lg font-bold mb-2 text-black" />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 text-black" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-6 mb-4 text-black" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-1" />
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    // Start tracking this analysis in the global context.
    console.log('docId', docId);
    if (docId) {
      trackLLMTxt(docId, url);
    }
  }, [docId, router, trackLLMTxt, url]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentLLMTxt && currentLLMTxt.type === "llmstxt") {
      setStatus(currentLLMTxt.status);
      setAnalysisData(currentLLMTxt.data || null);
      setUrl(currentLLMTxt.url || "");
      setUpdatedAt(currentLLMTxt.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentLLMTxt.status === "completed" ||
        currentLLMTxt.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentLLMTxt.error) {
        setError(currentLLMTxt.error);
      }
    }
  }, [currentLLMTxt]);


  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };



  // If no docId, show the form
  if (!docId) {
    router.push("/llmstxt");
  }

  // If there's an error, show the error screen
  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // If loading, show the loading screen
  if (loadingPage) {
    return (
      <>
        <LoadingScreenLLM status={status} docId={docId} />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black ">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ffcc0070] to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-black">
              LLMS Text Analysis Results
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-bold text-primary">URL:</span> {url}
                </p>
                {/* <p className="text-sm text-gray-400">
                  <span className="font-bold">Analysis Date:</span> {updatedAt}
                </p> */}
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-[#f9f9f9] hover:bg-[#e0e0e0] text-black px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer border "
                  onClick={() => copyToClipboard(activeTab === 'llmtxt' ? analysisData.llmstxt : analysisData.llmsfulltxt)}
                >
                  <Copy size={16} />
                  Copy Text
                </button>
                <button
                  className="bg-primary hover:bg-primary/90 text-black font-bold px-4 py-2 rounded-md flex items-center gap-2 transition-all cursor-pointer"
                  onClick={() => downloadTxt(
                    activeTab === 'llmtxt' ? analysisData.llmtxt : analysisData.llmsfulltxt,
                    activeTab === 'llmtxt' ? 'llms.txt' : 'llms-full.txt'
                  )}
                >
                  <DownloadCloud size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto bg-[#f9f9f9] p-8 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <Tabs
                defaultValue="llmtxt"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="w-full flex mb-6">
                  <TabsTrigger value="llmtxt" className="flex-1 cursor-pointer">LLMS.txt (Shortened)</TabsTrigger>
                  <TabsTrigger value="llmsfulltxt" className="flex-1 cursor-pointer">LLMS-Full.txt (Complete)</TabsTrigger>
                </TabsList>

                <div className="flex justify-end mb-4">
                  <div className="bg-[#f0f0f0] rounded-md p-1 flex">
                    <button
                      className={`px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer ${viewMode === 'text' ? 'bg-primary text-black' : 'text-gray-700'}`}
                      onClick={() => setViewMode('text')}
                    >
                      <FileText size={16} />
                      <span>Text</span>
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer ${viewMode === 'markdown' ? 'bg-primary text-black' : 'text-gray-700'}`}
                      onClick={() => setViewMode('markdown')}
                    >
                      <FileCode size={16} />
                      <span>Markdown</span>
                    </button>
                  </div>
                </div>

                <TabsContent value="llmtxt" className="focus:outline-none">
                  {renderContent(analysisData.llmstxt)}
                </TabsContent>

                <TabsContent value="llmsfulltxt" className="focus:outline-none">
                  {renderContent(analysisData.llmsfulltxt)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Container>
      </section>

      {/* Results Explanation */}
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

      {/* Action Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-[#FFDD00]">
        <Container>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-black mb-6">
              Want to Improve Your LLMS Text Representation?
            </h2>
            <p className="text-lg text-black/80 max-w-3xl mx-auto mb-8">
              Get expert recommendations on how to optimize your content for both users and search engines. Our SEO tools help you cut through the noise and focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/llmstxt" size="lg" className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-md transition-all">
                Run Another Analysis
              </Button>
              <Button href="/free-tools" size="lg" className="bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-md transition-all">
                Browse Our SEO Tools
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default function LLMTxtResultPage() {
  return (
    <Suspense>
      <LLMTxtResult />
    </Suspense>
  );
}
