"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, TriangleAlert, LoaderCircle, ArrowLeft, Key } from "lucide-react";
import { ChevronRight, ChevronDown, Edit, FileText, User, Target, AlertTriangle, Clipboard, Link as LinkIcon, CheckCircle, ExternalLink, Copy, Download, MessageCircleQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/evaluation/StatusBadge";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreenContentPlanning from "@/components/LoadingScreenContentPlanning";

function Evaluation() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [taskLocale, setTaskLocale] = useState("")
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [evidence, setEvidence] = useState({})
  const [evaluation, setEvaluation] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const { trackEvaluation, currentEvaluation, removeEvaluation } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentEvaluation ? currentEvaluation.status : "initializing"
  );
  const [activeTab, setActiveTab] = useState('page-quality');



  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackEvaluation(docId, url, query, userLocation, taskLocale);
    }
  }, [docId, router, trackEvaluation, url, query, userLocation, taskLocale]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentEvaluation && currentEvaluation.type === "evaluation") {
      setStatus(currentEvaluation.status);
      setEvaluation(currentEvaluation.data || null);
      setUrl(currentEvaluation.url || "");
      setQuery(currentEvaluation.query || "");
      setEvidence(currentEvaluation?.data?.supportingEvidence || {})
      setUserLocation(currentEvaluation.userLocation || "");
      setTaskLocale(currentEvaluation.taskLocale || "");
      setUpdatedAt(currentEvaluation.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentEvaluation.status === "completed" ||
        currentEvaluation.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentEvaluation.error) {
        setError(currentEvaluation.error);
      }
    }
  }, [currentEvaluation]);


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
    router.push("/evaluation");
  }

  // If there's an error, show the error screen
  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-foreground">{error}</p>
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
        <LoadingScreenContentPlanning status={status} docId={docId} />
      </>
    );
  }

  // If we have data, show the content planning results
  return (

    <Container className="flex min-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          {/* Summary Section */}
          <Card className="mb-6">
            <CardContent className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground/60">URL</h4>
                  <p className="text-sm text-foreground break-all">{evaluation.landingPageURL}</p>

                  <h4 className="text-sm font-medium text-foreground/60 mt-3">Query</h4>
                  <p className="text-sm text-foreground">"{evaluation.userQuery}"</p>

                  <h4 className="text-sm font-medium text-foreground/60 mt-3">User Location</h4>
                  <p className="text-sm text-foreground">{evaluation.userLocation}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground/60">Page Quality (PQ)</h4>
                    <StatusBadge type="pq" status={evaluation.pqRating} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <h4 className="text-sm font-medium text-foreground/60">Needs Met (NM)</h4>
                    <StatusBadge type="nm" status={evaluation.nmRating} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <h4 className="text-sm font-medium text-foreground/60">Flags</h4>
                    <span className="text-sm text-foreground">
                      {evidence.Step14_Flags && Object.keys(evidence.Step14_Flags).some(key => evidence.Step14_Flags[key])
                        ? Object.keys(evidence.Step14_Flags)
                          .filter(key => evidence.Step14_Flags[key])
                          .join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="page-quality">Page Quality</TabsTrigger>
              <TabsTrigger value="needs-met">Needs Met</TabsTrigger>
              <TabsTrigger value="raw-data">Raw Data</TabsTrigger>
            </TabsList>

            {/* Page Quality Tab Content */}
            <TabsContent value="page-quality" className="space-y-4">
              {/* Page Purpose */}
              <Card>
                <CardHeader className="">
                  <CardTitle>Page Purpose & Type</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">Primary Purpose</dt>
                      <dd className="mt-1 text-sm text-foreground">{evidence.Step1?.Purpose || "Unknown"}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">Is Purpose Beneficial</dt>
                      <dd className="mt-1 text-sm text-foreground">{evidence.Step1?.Beneficial ? "Yes" : "No"}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">Website Type</dt>
                      <dd className="mt-1 text-sm text-foreground">{evidence.Step1?.Type || "Unknown"}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">YMYL Topic</dt>
                      <dd className="mt-1 text-sm text-foreground">{evidence.Step3?.IsYMYL ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Harm/Gatekeeper Checks */}
              <Card>
                <CardHeader className="">
                  <CardTitle>Harm & Gatekeeper Checks</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-foreground/10">
                    {evidence.Step2_HarmChecks && Object.entries(evidence.Step2_HarmChecks).map(([key, value]) => (
                      <li key={key} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <StatusBadge type="check" status={value ? "Fail" : "Pass"} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* E-E-A-T Assessment */}
              {evidence.Step8?.Scores && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>E-E-A-T Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {Object.entries(evidence.Step8.Scores).map(([key, value]) => (
                        <div key={key} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-foreground/60">{key}</dt>
                          <dd className="mt-1 text-sm text-foreground">{value}</dd>
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">E-E-A-T Appropriateness</dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step8.Appropriateness ? "Appropriate" : "Not Appropriate"}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Main Content Quality */}
              {evidence.Step6 && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>Main Content Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {Object.entries(evidence.Step6).map(([key, value]) => (
                        <div key={key} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-foreground/60">{key}</dt>
                          <dd className="mt-1 text-sm text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Needs Met Tab Content */}
            <TabsContent value="needs-met" className="space-y-4">
              {/* Query Analysis */}
              {evidence.Step12 && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>Query & User Intent</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">Query Analysis</dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {JSON.stringify(evidence.Step12?.queryAnalysis, null, 2)}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">Interpretations</dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {JSON.stringify(evidence.Step12?.interpretations, null, 2)}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">User Intent</dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {JSON.stringify(evidence.Step12?.intent, null, 2)}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Relevance Evaluation */}
              {evidence.Step13 && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>Relevance Evaluation</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">Rating Basis</dt>
                        <dd className="mt-1 text-sm text-foreground">{evidence.Step13?.ratingBasis}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">Relevance Score</dt>
                        <dd className="mt-1 text-sm text-foreground">{evidence.Step13?.relevanceScore}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Flags */}
              {evidence.Step14_Flags && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>Evaluation Flags</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {Object.entries(evidence.Step14_Flags).map(([key, value]) => (
                        <div key={key} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-foreground/60">{key}</dt>
                          <dd className="mt-1 text-sm text-foreground">{value ? "Yes" : "No"}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* NM Factors */}
              {evidence.Step15 && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>NM Factor Adjustments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {evidence.Step15?.Adjustments && Object.entries(evidence.Step15.Adjustments).map(([key, value]) => (
                        <div key={key} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-foreground/60">{key}</dt>
                          <dd className="mt-1 text-sm text-foreground">{value}</dd>
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">Final Relevance Score</dt>
                        <dd className="mt-1 text-sm text-foreground">{evidence.Step15?.FinalRelevance}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Raw Data Tab */}
            <TabsContent value="raw-data">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Evaluation Data</CardTitle>
                  <CardDescription>Raw JSON data from the evaluation process</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs  p-4 rounded-md overflow-auto max-h-[600px]">
                    {JSON.stringify(evaluation, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Container>

  );
}

export default function EvaluationPage() {
  return (
    <Suspense>
      <Evaluation />
    </Suspense>
  );
}
