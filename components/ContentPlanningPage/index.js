"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, TriangleAlert, LoaderCircle, ArrowLeft, Key } from "lucide-react";
import { ChevronRight, ChevronDown, Edit, FileText, User, Target, AlertTriangle, Clipboard, Link as LinkIcon, CheckCircle, ExternalLink, Copy, Download, MessageCircleQuestion } from 'lucide-react';
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { getPathname } from "@/lib/getpathname";

function ContentPlanning() {
  const [keyword, setKeyword] = useState("");
  const [contentType, setContentType] = useState("blog_post");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");

  const { trackAnalysis, currentAnalysis, clearAnalysis } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAnalysis ? currentAnalysis.status : "initializing"
  );
  const [activeTab, setActiveTab] = useState('structure');
  // Initialize the first H1 to be expanded
  const initialExpandedSections = {};
  analysisData?.content_structure?.headings.forEach((heading, index) => {
    if (heading.level === 'H1') {
      initialExpandedSections[`heading-0-${index}`] = true;
    }
  });
  const [expandedSections, setExpandedSections] = useState(initialExpandedSections);



  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackAnalysis({
        type: "content-planning",
        docId: docId,
        collection: "contentPlanning",
        meta: {
          keyword: keyword,
        },
      });
    }
  }, [docId, router, trackAnalysis, keyword]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.type === "content-planning") {
      setStatus(currentAnalysis.status);
      setAnalysisData(currentAnalysis.data || null);
      setKeyword(currentAnalysis.keyword || "");
      setContentType(currentAnalysis.contentType || "blog_post");
      setUpdatedAt(currentAnalysis.updatedAt || "");

      // Stop loading when analysis is completed or failed.
      if (
        currentAnalysis.status === "completed" ||
        currentAnalysis.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }

      if (currentAnalysis.error) {
        setError(currentAnalysis.error);
      }
    }
  }, [currentAnalysis]);

  useEffect(() => {
    if (analysisData?.content_structure?.headings) {
      const newExpandedSections = {};
      analysisData.content_structure.headings.forEach((heading, index) => {
        if (heading.level === 'H1') {
          newExpandedSections[`heading-0-${index}`] = true;
        }
      });
      setExpandedSections(newExpandedSections);
    }
  }, [analysisData]);

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




  const renderHeadingStructure = (headings) => {
    return (
      <ul className="space-y-2">
        {headings?.map((heading, index) => (
          <li key={index} className="border-b border-border/10 pb-2">
            <div>
              <span className="font-semibold">{heading.level}:</span>{" "}
              {heading.text}
            </div>
            {heading.children && heading.children.length > 0 && (
              <div className="ml-4 mt-2">
                {renderHeadingStructure(heading.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Function to toggle section expansion
  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to render headings recursively
  const renderHeadings = (heading, depth = 0, index = 0) => {
    const hasChildren = heading.children && heading.children.length > 0;
    const headingId = `heading-${depth}-${index}-${heading.text.replace(/\s+/g, '-').toLowerCase()}`;
    const isExpanded = expandedSections[headingId];
    const hasKeyPoints = heading.key_points && heading.key_points.length > 0;

    // Determine styling based on heading level
    let levelStyle = '';
    if (heading.level === 'H1') levelStyle = 'text-2xl font-black text-foreground';
    else if (heading.level === 'H2') levelStyle = 'text-xl font-bold text-primary';
    else if (heading.level === 'H3') levelStyle = 'text-lg font-semibold text-foreground/70';
    else if (heading.level === 'H4') levelStyle = 'text-base font-medium text-foreground/50';
    else levelStyle = 'text-sm font-normal text-foreground/50';

    // Calculate indentation
    let indentClass = '';
    if (heading.level !== 'H1') {
      if (heading.level === 'H2') indentClass = 'md:ml-4';
      else if (heading.level === 'H3') indentClass = 'md:ml-8';
      else if (heading.level === 'H4') indentClass = 'md:ml-12';
      else indentClass = 'md:ml-16';
    }

    return (
      <div key={headingId} className={indentClass}>
        <div
          className={"py-3 px-4 my-2 rounded-md bg-gray-100 dark:bg-accent text-foreground " + (hasChildren ? "cursor-pointer " : "") + "hover:bg-gray-200 dark:hover:bg-background transition-colors flex items-center"}
          onClick={hasChildren ? () => toggleSection(headingId) : undefined}
        >
          {hasChildren && (
            <span className="mr-2 text-primary">
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          )}
          <div className="flex flex-col flex-1">
            <div className="flex items-center">
              <span className={levelStyle + " mr-2"}>{heading.text}</span>
              <span className="text-xs  font-mono">{heading.level}</span>
            </div>

            {hasKeyPoints && (
              <div className="mt-2 flex flex-wrap gap-2">
                {heading.key_points.map((point, idx) => (
                  <span key={idx} className="bg-card text-xs text-foreground/80 px-2 py-1 md:rounded-full rounded-sm">
                    {point}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="md:pl-4 pl-1 border-l-2 border-foreground/10">
            {heading.children.map((child, idx) => renderHeadings(child, depth + 1, idx))}
          </div>
        )}
      </div>
    );
  };

  const contentData = analysisData || {};
  const contentStructure = contentData.content_structure || {};
  const userPersona = contentData.user_persona || {};


  // If no docId, show the form
  if (!docId) {
    router.push(getPathname("content-planning"));
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
        <LoadingScreen status={status} type="content-planning" />
      </>
    );
  }

  // If we have data, show the content planning results
  return (
    <div className="min-h-screen pb-14 bg-background text-foreground">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-background to-[#ffcc0070] dark:from-[#4e503a] dark:to-background py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFDD00" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <Container className=" relative z-10">
          <div className="flex items-center gap-3 text-foreground/80 text-sm mb-4">
            <span><Link href="/content-planning" className="hover:text-primary transition-colors"> Content Planning</Link></span>
            <ChevronRight size={16} />
            <span className="text-primary font-bold">{contentData.keyword || 'New Content'}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {contentStructure.title || 'Content Plan'}
              </h1>


              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-[#333333] text-white dark:text-foreground px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <FileText size={14} className="mr-1" />
                  {contentData.content_type?.replace('_', ' ') || 'Unknown Type'}
                </span>
                {contentStructure.word_count_range && (
                  <span className="bg-primary text-black px-3 py-1 rounded-full text-sm font-bold inline-flex items-center">
                    <Clipboard size={14} className="mr-1" />
                    {contentStructure.word_count_range}
                  </span>
                )}
                <span className="bg-[#333333] text-white dark:text-foreground px-3 py-1 rounded-full text-sm inline-flex items-center">
                  <Target size={14} className="mr-1" />
                  Keyword: {contentData.keyword || 'None'}
                </span>
              </div>
              <p className="text-foreground/80 text-lg">{contentStructure.introduction || 'No introduction provided.'}</p>
            </div>

            {/* <div className="flex flex-col gap-2 mt-6 md:mt-0">
              <button className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-all">
                <Edit size={18} />
                Edit Content Plan
              </button>
              <button className="bg-[#222222] hover:bg-[#333333] text-white font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-all">
                <Download size={18} />
                Export as PDF
              </button>
            </div> */}
          </div>
        </Container>
      </div>

      {/* Tab Navigation */}
      <Container className="mt-8">
        <div className="border-b border-border flex overflow-x-auto hide-scrollbar">
          <button
            className={"px-6 cursor-pointer py-3 text-lg font-bold border-b-2 mr-4 hover:text-primary transition-colors " +
              (activeTab === 'structure' ? 'border-primary text-primary' : 'border-transparent text-foreground/80')}
            onClick={() => setActiveTab('structure')}
          >
            Content Structure
          </button>
          <button
            className={"px-6 cursor-pointer py-3 text-lg font-bold border-b-2 mr-4 hover:text-primary transition-colors " +
              (activeTab === 'persona' ? 'border-primary text-primary' : 'border-transparent text-foreground/80')}
            onClick={() => setActiveTab('persona')}
          >
            User Persona
          </button>
          <button
            className={"px-6 cursor-pointer py-3 text-lg font-bold border-b-2 mr-4 hover:text-primary transition-colors " +
              (activeTab === 'tips' ? 'border-primary text-primary' : 'border-transparent text-foreground/80')}
            onClick={() => setActiveTab('tips')}
          >
            Content Tips
          </button>
        </div>
      </Container>

      {/* Main Content Area */}
      <Container className="!py-8">
        {activeTab === 'structure' && (
          <div>
            {/* Meta Description Section */}
            <div className="bg-card rounded-lg md:p-6 p-3 mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <FileText size={16} />
                </span>
                Meta Description
              </h2>
              <div className="dark:bg-accent bg-gray-100 p-4 rounded-md relative group">
                <p className="text-foreground/80">{contentStructure.meta_description || 'No meta description provided.'}</p>
                <button
                  className="absolute top-2 right-2 p-2 bg-card rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => copyToClipboard(contentStructure.meta_description)}
                >
                  <Copy size={14} className="text-foreground/80 hover:text-primary" />
                </button>
              </div>
            </div>

            {/* Content Structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Headings Structure */}
              <div className="md:col-span-2">
                <div className="bg-card rounded-lg md:p-6 p-3">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                      <FileText size={16} />
                    </span>
                    Content Outline
                  </h2>
                  <div className="text-sm text-foreground/80 mb-6">
                    {contentStructure.sections_explanation || 'No explanation provided for this content structure.'}
                  </div>
                  <div className="space-y-2">
                    {contentStructure.headings?.map((heading) => renderHeadings(heading))}
                  </div>
                </div>
              </div>


              {/* Sidebar Information */}
              <div className="md:col-span-1 flex flex-col gap-6">
                {/* CTAs */}
                <div className="bg-card rounded-lg md:p-6 p-3">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                      <CheckCircle size={16} />
                    </span>
                    Call-to-Actions
                  </h2>
                  {contentStructure.cta_recommendations?.length > 0 ? (
                    <ul className="space-y-3">
                      {contentStructure.cta_recommendations.map((cta, index) => (
                        <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                          <CheckCircle size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-foreground/80">{cta}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-foreground/80">No CTA recommendations available.</p>
                  )}
                </div>

                {/* Internal Linking */}
                <div className="bg-card rounded-lg md:p-6 p-3">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                      <LinkIcon size={16} />
                    </span>
                    Internal Linking Strategy
                  </h2>
                  {contentStructure.internal_linking_strategy?.length > 0 ? (
                    <ul className="space-y-3">
                      {contentStructure.internal_linking_strategy.map((link, index) => (
                        <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                          <ExternalLink size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-foreground/80">{link}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-foreground/80">No internal linking strategy available.</p>
                  )}
                </div>

                {/* FAQ Section Recommendations */}
                <div className="bg-card rounded-lg md:p-6 p-3">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                      <MessageCircleQuestion size={16} />
                    </span>
                    FAQ Section Recommendations
                  </h2>
                  {contentStructure.questions_to_answer?.length > 0 ? (
                    <>
                      <ul className="space-y-3">
                        {contentStructure.questions_to_answer.map((question, index) => (
                          <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                            <span className="text-foreground/80">{question}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-foreground/80">Tip: Use FAQ Schema markup to improve chances of appearing in featured snippets</p>
                    </>
                  ) : (
                    <p className="text-foreground/80">No FAQ section recommendations available.</p>
                  )}

                </div>

                {/* Keywords to Target */}
                <div className="bg-card rounded-lg md:p-6 p-3">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                      <Key size={16} />
                    </span>
                    Keywords to Target
                  </h2>
                  {contentStructure.keywords_to_include?.length > 0 ? (
                    <>
                      <ul className="space-y-3">
                        {contentStructure.keywords_to_include.map((keyword_to_include, index) => (
                          <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                            <span className="text-foreground/80">{keyword_to_include}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-foreground/80">No keywords to target available.</p>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'persona' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Persona Overview */}
            <div className="bg-card rounded-lg md:p-6 p-3">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <User size={16} />
                </span>
                User Persona
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="dark:bg-accent bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-foreground/80 mb-1">Age Range</h3>
                  <p className="text-lg font-bold">{userPersona.age_range || 'Not specified'}</p>
                </div>
                <div className="dark:bg-accent bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-foreground/80 mb-1">Gender</h3>
                  <p className="text-lg font-bold">{userPersona.gender || 'Not specified'}</p>
                </div>
                <div className="dark:bg-accent bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-foreground/80 mb-1">Education</h3>
                  <p className="text-lg font-bold">{userPersona.education_level || 'Not specified'}</p>
                </div>
                <div className="dark:bg-accent bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-foreground/80 mb-1">Income Level</h3>
                  <p className="text-lg font-bold">{userPersona.income_level || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-card rounded-lg md:p-6 p-3">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <Target size={16} />
                </span>
                User Goals
              </h2>
              {userPersona.goals?.length > 0 ? (
                <ul className="space-y-3">
                  {userPersona.goals.map((goal, index) => (
                    <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-foreground/80">{goal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80">No user goals specified.</p>
              )}
            </div>

            {/* Pain Points */}
            <div className="bg-card rounded-lg md:p-6 p-3">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <AlertTriangle size={16} />
                </span>
                Pain Points
              </h2>
              {userPersona.pain_points?.length > 0 ? (
                <ul className="space-y-3">
                  {userPersona.pain_points.map((pain, index) => (
                    <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                      <AlertTriangle size={16} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-foreground/80">{pain}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80">No pain points specified.</p>
              )}
            </div>

            {/* Information Needs */}
            <div className="bg-card rounded-lg md:p-6 p-3">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <FileText size={16} />
                </span>
                Information Needs
              </h2>
              {userPersona.information_needs?.length > 0 ? (
                <ul className="space-y-3">
                  {userPersona.information_needs.map((need, index) => (
                    <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                      <CheckCircle size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-foreground/80">{need}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80">No information needs specified.</p>
              )}
            </div>

            {/* Objections */}
            <div className="bg-card rounded-lg md:p-6 p-3">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                  <AlertTriangle size={16} />
                </span>
                Objections
              </h2>
              {userPersona.objections?.length > 0 ? (
                <ul className="space-y-3">
                  {userPersona.objections.map((objection, index) => (
                    <li key={index} className="dark:bg-accent bg-gray-100 p-4 rounded-md flex items-start">
                      <AlertTriangle size={16} className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-foreground/80">{objection}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-foreground/80">No objections specified.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="bg-card rounded-lg md:p-6 p-3">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full inline-flex items-center justify-center mr-3">
                <Clipboard size={16} />
              </span>
              Content Creation Tips
            </h2>
            {contentStructure.content_tips?.length > 0 ? (
              <ul className="space-y-4">
                {contentStructure.content_tips.map((tip, index) => (
                  <li key={index} className="dark:bg-accent bg-gray-100 p-5 rounded-md flex items-start">
                    <span className="bg-primary text-primary-foreground h-6 w-6 rounded-full inline-flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-foreground/80 text-lg font-medium">{tip}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/80">No content tips available.</p>
            )}
          </div>
        )}
      </Container>

      {/* Action Bar */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-4 px-6 z-20">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-gray-300">
            <span className="font-bold text-primary">Keyword:</span> {contentData.keyword}
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#333333] hover:bg-[#444444] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all">
              <FileText size={16} />
              Save as Template
            </button>
            <button className="bg-primary hover:bg-primary/90 text-black font-bold px-4 py-2 rounded-md flex items-center gap-2 transition-all">
              <Edit size={16} />
              Start Writing
            </button>
          </div>
        </Container>
      </div> */}
    </div>
  );
}

export default function ContentPlanningPage() {
  return (
    <Suspense>
      <ContentPlanning />
    </Suspense>
  );
}
