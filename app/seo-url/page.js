"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Container from "@/components/container";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";

export default function SeoUrlPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      router.push('/');
      return;
    }

    // Set up timeout for 5 minutes
    const timeout = setTimeout(() => {
      setError("Analysis is taking longer than expected. Please try again later.");
    }, 5 * 60 * 1000);
    setTimeoutId(timeout);

    // Listen for changes to the document
    const unsubscribe = onSnapshot(doc(db, 'seoAnalyses', id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAnalysis(data);

        if (data.status === 'completed') {
          clearTimeout(timeoutId);
          // Redirect to the SEO audit page with the analysis data
          router.push(`/seo-audit?url=${encodeURIComponent(data.url)}`);
        } else if (data.status === 'error') {
          clearTimeout(timeoutId);
          setError(data.error || "An error occurred during analysis.");
        }
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [searchParams, router]);

  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <LoadingScreen />
      </div>
    </Container>
  );
} 