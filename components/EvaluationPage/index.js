"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/evaluation/StatusBadge";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { JsonEditor, githubDarkTheme, githubLightTheme } from "json-edit-react";
import { useTheme } from "next-themes";
import LoadingScreen from "@/components/LoadingScreen";
import { getPathname } from "@/lib/getpathname";
import { Separator } from "@/components/ui/separator";

const harmTooltips = {
  maliciousBehavior: "Scans for scams, phishing links, or malware indicators.",
  spam: "Flags low-value pages: hacked content, auto-generated spam, or republished material without added value.",
  deceptiveDesign:
    "Looks for trickery—hidden ads, disguised links, or misleading layouts.",
  harmfulMisinfo:
    "Detects blatantly false or dangerous claims that contradict expert consensus.",
  harmToSelfOthers: "Identifies content that encourages self-harm or violence.",
  anyHarmDetected: "Overall flag: true if any of the above checks failed.",
  harmToGroups:
    "Checks for hateful or discriminatory content toward any protected group.",
  noPurposeMC: "No Purpose/MC",
};
const contactTooltips = {
  hasAddress: "Indicates if a physical address (street, city) is listed.",
  hasPhone:
    "Whether there’s a dedicated “About Us” page explaining the company or author.",
  hasAboutPage: "True if a customer-service or general contact email appears.",
  hasEmail: "True if a recognizable phone number is provided.",
  hasContactForm:
    "True if the site offers an on-page form for direct inquiries.",
};
const ecommercePoliciesTooltips = {
  hasReturnPolicy: "Presence of clear refund or returns information.",
  hasTermsOfService: "Indicates if legal terms or conditions are published.",
  httpsSecure: "Confirms the site uses HTTPS for secure connections.",
  hasPrivacyPolicy:
    "Whether a privacy policy link is visible (data handling and user rights).",
  hasPaymentInfo:
    "True if payment methods or checkout instructions are clearly described.",
};

const eeatAssessmentTooltips = {
  expertise: "Level of author or site knowledge demonstrated for the topic.",
  isAppropriate:
    "Whether the combined E-E-A-T level meets the standard required for this content type (especially YMYL).",
  trust: "Overall confidence in the page’s accuracy, safety, and honesty.",
  experience:
    "Evidence of first-hand, real-world usage or life experience related to the topic.",
  authoritativeness:
    "Whether the site or author is recognized as a reliable authority in this field.",
};
const contentQualityTooltips = {
  talentSkill:
    "How well the content is created or written—professionalism, clarity, polish.",
  originality: "Degree to which content is unique vs. copied or generic.",
  presentation:
    "Organization, readability, and design quality of the main content.",
  effort:
    "Apparent amount of work and care that went into producing the content.",
  accuracy: "Factual correctness and reliability of the information presented.",
  depth: "Level of detail and comprehensiveness on the subject.",
};

const lowQualityTooltips = {
  MisleadingTitle: "Page title misrepresents the actual content.",
  DistractingAdsSC:
    "Ads or supplementary content that significantly interferes with reading.",
  LowEEAT:
    "Insufficient expertise, experience, authoritativeness, or trust signals.",
  UnsatisfyingInfo: "Contact/about info that is missing or too vague.",
  LowMC: "Main content shows signs of low effort, thin coverage, or filler.",
  MildlyNegativeRep:
    "Subtle reputation concerns (isolated complaints, mixed reviews).",
};
const nmfactorsTooltips = {
  URLQueryMatch:
    "Reward if the URL or title directly matches the search terms.",
  Location:
    "Adjust if local relevance is required and the page mentions the location.",
  Freshness:
    "Boost if content is up to date when the query demands it; penalize if stale.",
  Specificity:
    "Adjust based on how precisely the content covers the query topic.",
};

const typepageTooltips = {
  forumsOrQA:
    "Checks if the page hosts forum threads or Q&A; rates based on helpfulness and civility.",
  encyclopedia:
    "Whether the page is a neutral, reference-style article; quality rates how well it meets encyclopedia standards.",
  shoppingPage:
    "Applies to product or service sites; rating reflects trust signals, clear pricing, and ease of purchase.",
  errorOrNoMC:
    "Identifies 404s or pages with no real content; lowest quality if no meaningful page.",
};
const flagsTooltips = {
  upsettingOffensive: "The page contains disturbing or offensive content.",
  porn: "The page contains pornographic or sexually explicit content.",
  foreignLanguage: "The primary content is in a non-target language.",
  didNotLoad: "The page failed to load during evaluation.",
};

function Evaluation() {
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [taskLocale, setTaskLocale] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(null);
  const [evidence, setEvidence] = useState({});
  const [evaluation, setEvaluation] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const { resolvedTheme } = useTheme();
  const [sendToEmail, setSendToEmail] = useState(false);

  const { trackAnalysis, currentAnalysis, clearAnalysis } =
    useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");
  const [status, setStatus] = useState(
    currentAnalysis ? currentAnalysis?.status : "initializing"
  );
  const [activeTab, setActiveTab] = useState("page-quality");

  useEffect(() => {
    // Start tracking this analysis in the global context.

    if (docId) {
      trackAnalysis({
        type: "evaluation",
        docId: docId,
        collection: "evaluations",
        meta: {
          url: url,
          query: query,
          userLocation: userLocation,
          taskLocale: taskLocale,
        },
      });
    }
  }, [docId, router, trackAnalysis, url, query, userLocation, taskLocale]);

  // Listen for changes in the global analysis state.
  useEffect(() => {
    if (currentAnalysis && currentAnalysis?.type === "evaluation") {
      setStatus(currentAnalysis?.status);
      setEvaluation(currentAnalysis?.data || null);
      setUrl(currentAnalysis?.url || "");
      setQuery(currentAnalysis?.query || "");
      setEvidence(currentAnalysis?.data?.supportingEvidence || {});
      setUserLocation(currentAnalysis?.userLocation || "");
      setTaskLocale(currentAnalysis?.taskLocale || "");
      setUpdatedAt(currentAnalysis?.updatedAt || "");
      setSendToEmail(currentAnalysis?.sendToEmail || false);

      // Stop loading when analysis is completed or failed.

      if (
        currentAnalysis?.status === "completed" ||
        currentAnalysis?.status === "failed"
      ) {
        setLoadingPage(false);
      } else {
        setLoadingPage(true);
      }
      if (currentAnalysis?.error) {
        setError(currentAnalysis?.error);
      }
    }
  }, [currentAnalysis]);

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // If no docId, show the form
  if (!docId) {
    router.push(getPathname("evaluation"));
  }

  // If there's an error, show the error screen
  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-foreground">{error}</p>
            <Button href="/eeat-checker" className="mt-4">
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
        <LoadingScreen status={status} type="evaluation" docId={docId} collection="evaluations" sendToEmail={sendToEmail} />
      </>
    );
  }

  // If we have data, show the content planning results
  return (
    <Container className="flex min-h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="py-6">
          {/* Summary Section */}
          <Card className="mb-6">
            <CardContent className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground/60">
                    URL
                  </h4>
                  <p className="text-sm text-foreground break-all">
                    {evaluation?.landingPageURL}
                  </p>

                  <h4 className="text-sm font-medium text-foreground/60 mt-3">
                    Query
                  </h4>
                  <p className="text-sm text-foreground">
                    "{evaluation?.userQuery}"
                  </p>

                  <h4 className="text-sm font-medium text-foreground/60 mt-3">
                    User Location
                  </h4>
                  <p className="text-sm text-foreground">
                    {evaluation?.userLocation}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 items-center">
                      <h4 className="text-sm font-medium text-foreground/60">
                        Page Quality (PQ)
                      </h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger aria-label="more information">
                            <Info className="text-foreground/60" size={16} />
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-[200px] p-2"
                            side="right"
                          >
                            Page Quality (PQ) reflects the overall expertise,
                            authoritativeness, and trustworthiness of the page’s
                            main content.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <StatusBadge type="pq" status={evaluation?.pqRating} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <h4 className="text-sm font-medium text-foreground/60">
                      <div className="flex items-center gap-1">
                        <span>Needs Met (NM)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger aria-label="more information">
                              <Info className="text-foreground/60" size={16} />
                            </TooltipTrigger>
                            <TooltipContent
                              className="max-w-[200px] p-2"
                              side="right"
                            >
                              final Needs Met (NM) rating for the search result
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </h4>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger aria-label="more information">
                          <StatusBadge
                            type="nm"
                            status={evaluation?.nmRating}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          className="max-w-[200px] p-2"
                          side="right"
                        >
                          <p>"FailsM" (Fails Meets)</p>
                          "SM" (Slightly Meets) "MM" (Moderately Meets) "HM"
                          (Highly Meets) "FullyM" (Fully Meets)
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-medium text-foreground/60">
                        Flags
                      </h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger aria-label="more information">
                            <Info className="text-foreground/60" size={16} />
                          </TooltipTrigger>
                          <TooltipContent
                            className="max-w-[200px] p-2"
                            side="right"
                          >
                            Additional evaluation tags noted during analysis.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm text-foreground">
                      {evidence.Step14_Flags &&
                        Object.keys(evidence.Step14_Flags).some(
                          (key) => evidence.Step14_Flags[key]
                        )
                        ? Object.keys(evidence.Step14_Flags)
                          .filter((key) => evidence.Step14_Flags[key])
                          .join(", ")
                        : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full md:grid-cols-4 grid-cols-1 ">
              <TabsTrigger value="page-quality">Page Quality</TabsTrigger>
              <TabsTrigger value="needs-met">Needs Met</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
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
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>Primary Purpose</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                Describes what the page is mainly trying to do
                                (inform, sell, entertain, etc.).
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Step1?.Purpose || "Unknown"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>Is Purpose Beneficial</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                Indicates whether the page’s purpose genuinely
                                helps or adds value for visitors.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Step1?.Beneficial ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>Website Type</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                Classifies the site’s genre (e.g., e-commerce,
                                blog, news, corporate).
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Step1?.Type || "Unknown"}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>YMYL Topic</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                “Your Money or Your Life” topics can impact
                                health, safety, or finances—these require
                                especially high trust.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Step3?.IsYMYL ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>Topic Classification</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                The specific subject area of the page (e.g.,
                                “safety information”, “financial advice”).
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Step3?.Topic || "Unknown"}
                      </dd>
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
                    {evidence.Step2_HarmChecks &&
                      Object.entries(evidence.Step2_HarmChecks).map(
                        ([key, value]) => (
                          <li key={key} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-foreground">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger aria-label="more information">
                                      <Info
                                        className="text-foreground/60"
                                        size={16}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent
                                      className="max-w-[200px] p-2"
                                      side="right"
                                    >
                                      {harmTooltips[key]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <StatusBadge
                                type="check"
                                status={value ? "Fail" : "Pass"}
                              />
                            </div>
                          </li>
                        )
                      )}
                  </ul>
                </CardContent>
              </Card>

              {/* Website/Creator Information (Step 5) */}
              {evidence.Step5 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Website & Creator Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Ownership</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Who controls or publishes the site: an
                                  individual, an organization, or unknown.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step5.ownership}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Adequacy Assessment</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Whether the “About” and “Contact” info is
                                  sufficient for users to trust and reach the
                                  site owners.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step5.adequacyAssessment}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Author Information</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Summary of what’s known about who wrote or
                                  maintains the content (e.g. “Organization: EMC
                                  Security…”).
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step5.authorInfo}
                        </dd>
                      </div>
                    </dl>

                    <Separator className="my-6" />

                    <h4 className="text-sm font-medium text-foreground/60 mb-4">
                      Contact Information
                    </h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      {evidence.Step5.contactInfo &&
                        Object.entries(evidence.Step5.contactInfo).map(
                          ([key, value]) => (
                            <div key={key} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-foreground/60">
                                <div className="flex items-center gap-1">
                                  <span>
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger aria-label="more information">
                                        <Info
                                          className="text-foreground/60"
                                          size={16}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="max-w-[200px] p-2"
                                        side="right"
                                      >
                                        {contactTooltips[key]}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </dt>
                              <dd className="mt-1 text-sm text-foreground">
                                {value ? "Yes" : "No"}
                              </dd>
                            </div>
                          )
                        )}
                    </dl>

                    <Separator className="my-6" />

                    <h4 className="text-sm font-medium text-foreground/60 mb-4">
                      E-commerce Policies
                    </h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      {evidence.Step5.ecommercePolicies &&
                        Object.entries(evidence.Step5.ecommercePolicies).map(
                          ([key, value]) => (
                            <div key={key} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-foreground/60">
                                <div className="flex items-center gap-1">
                                  <span>
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger aria-label="more information">
                                        <Info
                                          className="text-foreground/60"
                                          size={16}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="max-w-[200px] p-2"
                                        side="right"
                                      >
                                        {ecommercePoliciesTooltips[key]}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </dt>
                              <dd className="mt-1 text-sm text-foreground">
                                {typeof value === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : value}
                              </dd>
                            </div>
                          )
                        )}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* E-E-A-T Assessment */}
              {evidence.Step8?.Scores && (
                <Card>
                  <CardHeader className="">
                    <CardTitle>E-E-A-T Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {Object.entries(evidence.Step8.Scores).map(
                        ([key, value]) => (
                          <div key={key} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-foreground/60">
                              <div className="flex items-center gap-1">
                                <span>{`${key}`}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger aria-label="more information">
                                      <Info
                                        className="text-foreground/60"
                                        size={16}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent
                                      className="max-w-[200px] p-2"
                                      side="right"
                                    >
                                      {eeatAssessmentTooltips[key]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </dt>
                            <dd className="mt-1 text-sm text-foreground">
                              {`${value}`}
                            </dd>
                          </div>
                        )
                      )}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>E-E-A-T Appropriateness</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Whether the combined E-E-A-T level meets the
                                  standard required for this content type
                                  (especially YMYL).
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step8.Appropriateness
                            ? "Appropriate"
                            : "Not Appropriate"}
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
                          <dt className="text-sm font-medium text-foreground/60">
                            <div className="flex items-center gap-1">
                              <span>{`${key}`}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger aria-label="more information">
                                    <Info
                                      className="text-foreground/60"
                                      size={16}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="max-w-[200px] p-2"
                                    side="right"
                                  >
                                    {contentQualityTooltips[key]}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Reputation Assessment (Step 7) */}
              {evidence.Step7 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Reputation Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-1">
                      <div>
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Reputation Score</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  A high-level view of the site’s standing
                                  (Negative to Very Positive) based on external
                                  signals.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step7.reputationScore}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span> Reputation Summary</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  A short narrative explaining why the site is
                                  considered reputable (or not).
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step7.reputationSummary}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}
              {/* Low Quality Checks */}
              {evidence.Step9_LowQualityChecks && (
                <Card>
                  <CardHeader>
                    <CardTitle>Low Quality Checks</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-foreground/20">
                      {Object.entries(evidence.Step9_LowQualityChecks).map(
                        ([key, value]) => (
                          <li key={key} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-foreground">
                                  {" "}
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger aria-label="more information">
                                      <Info
                                        className="text-foreground/60"
                                        size={16}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent
                                      className="max-w-[200px] p-2"
                                      side="right"
                                    >
                                      {lowQualityTooltips[key]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <StatusBadge
                                type="check"
                                status={value ? "Fail" : "Pass"}
                              />
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Needs Met Tab Content */}
            <TabsContent value="needs-met" className="space-y-4">
              {/* Query Analysis */}
              {evidence.Step12 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Query & User Intent</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Primary Intent</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  The main user goal (Know, Do, Website,
                                  Visit-in-Person).
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.intent?.primary}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Secondary Intent</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  A possible secondary action (e.g. buying,
                                  comparing).
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.intent?.secondary || "None"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Needs Local Results</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  True if the query likely expects local
                                  businesses or services.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.intent?.needsLocalResults
                            ? "Yes"
                            : "No"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60 ">
                          <div className="flex items-center gap-1">
                            <span>Location Relevance</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Indicates how important the user’s geographic
                                  location is to the query. Example:
                                  "Restaurants near me" has high location
                                  relevance.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.queryAnalysis?.locationRelevance}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Entities</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Key topics or concepts mentioned in the query.
                                  These help identify what the user is focused
                                  on.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.queryAnalysis?.entities?.join(", ")}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Dominant Interpretation</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  The single most likely meaning of the query.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step12.interpretations?.dominant}
                        </dd>
                      </div>
                    </dl>

                    <Separator className="my-6" />

                    <h4 className="text-sm font-medium text-foreground/60 mb-4">
                      <div className="flex items-center gap-1">
                        <span>Common Interpretations</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger aria-label="more information">
                              <Info className="text-foreground/60" size={16} />
                            </TooltipTrigger>
                            <TooltipContent
                              className="max-w-[200px] p-2"
                              side="right"
                            >
                              Other typical reasons users might search this
                              phrase.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {evidence.Step12.interpretations?.common?.map(
                        (interpretation, index) => (
                          <li key={index} className="text-sm text-foreground">
                            {interpretation}
                          </li>
                        )
                      )}
                    </ul>

                    <h4 className="text-sm font-medium text-foreground/60 mb-4 mt-6">
                      <div className="flex items-center gap-1">
                        <span>Minor Interpretations</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger aria-label="more information">
                              <Info className="text-foreground/60" size={16} />
                            </TooltipTrigger>
                            <TooltipContent
                              className="max-w-[200px] p-2"
                              side="right"
                            >
                              Less likely or niche possible meanings.
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {evidence.Step12.interpretations?.minor?.map(
                        (interpretation, index) => (
                          <li key={index} className="text-sm text-foreground">
                            {interpretation}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {/* Relevance Evaluation */}
              {evidence.Step13 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Relevance Evaluation</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Rating Basis</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Whether you evaluated the landing page itself,
                                  a Knowledge Panel, or another result type.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step13?.ratingBasis}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Relevance Score</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  A numeric rating (0–10) for how well the
                                  result answers the query.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step13?.relevanceScore}/10
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* NM Factors */}
              {evidence.Step15 && (
                <Card>
                  <CardHeader>
                    <CardTitle>NM Factor Adjustments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {evidence.Step15?.Adjustments &&
                        Object.entries(evidence.Step15.Adjustments).map(
                          ([key, value]) => (
                            <div key={key} className="sm:col-span-1">
                              <dt className="text-sm font-medium text-foreground/60">
                                <div className="flex items-center gap-1">
                                  <span> {key}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger aria-label="more information">
                                        <Info
                                          className="text-foreground/60"
                                          size={16}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="max-w-[200px] p-2"
                                        side="right"
                                      >
                                        {nmfactorsTooltips[key]}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </dt>
                              <dd className="mt-1 text-sm text-foreground">
                                {value}
                              </dd>
                            </div>
                          )
                        )}
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Final Relevance Score</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  The relevance score after applying all
                                  adjustments.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step15?.FinalRelevance}/10
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* PQ-NM Relationship */}
              {evidence.Step16 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Page Quality & Needs Met Relationship</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Lowest PQ → Fails to Meet</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Lowest-quality pages almost always fail to
                                  satisfy any user need.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step16.LowestPQ_FailsM ? "Yes" : "No"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Highly Meets Requires Medium+ PQ</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Even if relevance is high, a page with low
                                  quality cannot earn a top “Meets” rating.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step16.HM_Requires_MediumPQ ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}

              {/* Final Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Final Ratings</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span>Final Page Quality Rating</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                The overall PQ label: Lowest, Low, Medium, High,
                                or Highest.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Final_PQ_Rating}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-foreground/60">
                        <div className="flex items-center gap-1">
                          <span> Final Needs Met Rating</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger aria-label="more information">
                                <Info
                                  className="text-foreground/60"
                                  size={16}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                className="max-w-[200px] p-2"
                                side="right"
                              >
                                How well the result satisfies the query: FailsM,
                                SM, MM, HM, or FullyM.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </dt>
                      <dd className="mt-1 text-sm text-foreground">
                        {evidence.Final_NM_Rating}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Tab Content */}
            <TabsContent value="technical" className="space-y-4">
              {/* Content Structure */}
              {evidence.Step4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Title Quality</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  How accurately and helpfully the page title
                                  reflects the content.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step4.Title}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span> Supplementary Content</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Whether sidebars, related links, or navigation
                                  enhance or distract.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step4.SC}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span> Advertisements</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  The intrusiveness of ads: None, Minimal,
                                  Moderate, or Excessive.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step4.Ads}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              )}
              {/* Technical Issues (Step 11) */}
              {evidence.Step11 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Mobile Usability</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Whether the page displays and functions well
                                  on a smartphone viewport.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step11.mobileUsability}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Broken Elements</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  Count of resources (images, scripts) that
                                  failed to load.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step11.brokenElements}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Forms Working</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  True if basic forms (login, contact) submit
                                  successfully.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step11.formsWorking ? "Yes" : "No"}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-foreground/60">
                          <div className="flex items-center gap-1">
                            <span>Cart Functionality</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger aria-label="more information">
                                  <Info
                                    className="text-foreground/60"
                                    size={16}
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  className="max-w-[200px] p-2"
                                  side="right"
                                >
                                  True if “Add to Cart” or purchase flows work
                                  as expected.
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </dt>
                        <dd className="mt-1 text-sm text-foreground">
                          {evidence.Step11.cartFunctionality ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>

                    {evidence.Step11.screenshot && (
                      <div className="mt-6">
                        <dt className="text-sm font-medium text-foreground/60 mb-4">
                          Mobile Screenshot
                        </dt>
                        <div className="border rounded-lg w-fit  max-h-[400px] overflow-y-scroll">
                          <img
                            src={`/screenshots/${evidence.Step11.screenshot}`}
                            alt="Mobile screenshot"
                            className="max-w-full h-auto mx-auto rounded"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Special Page Types (Step 10) */}
              {evidence.Step10 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Special Page Type Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {Object.entries(evidence.Step10).map(
                        ([pageType, details]) => (
                          <div
                            key={pageType}
                            className="border-l-4 border-foreground/50 pl-4"
                          >
                            <div className="flex items-center gap-1 mb-2">
                              <h4 className="text-sm font-medium text-foreground ">
                                {pageType
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </h4>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger aria-label="more information">
                                    <Info
                                      className="text-foreground/60"
                                      size={16}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="max-w-[200px] p-2"
                                    side="right"
                                  >
                                    {typepageTooltips[pageType]}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <dl className="grid grid-cols-1 gap-2">
                              <div>
                                <dt className="text-sm font-medium text-foreground/60">
                                  Applies
                                </dt>
                                <dd className="text-sm text-foreground">
                                  {details.applies ? "Yes" : "No"}
                                </dd>
                              </div>
                              {details.quality && (
                                <div>
                                  <dt className="text-sm font-medium text-foreground/60">
                                    Quality
                                  </dt>
                                  <dd className="text-sm text-foreground">
                                    {details.quality}
                                  </dd>
                                </div>
                              )}
                              {details.notes && (
                                <div>
                                  <dt className="text-sm font-medium text-foreground/60">
                                    Notes
                                  </dt>
                                  <dd className="text-sm text-foreground">
                                    {details.notes}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Flags */}
              {evidence.Step14_Flags && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Flags</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      {Object.entries(evidence.Step14_Flags).map(
                        ([key, value]) => (
                          <div key={key} className="sm:col-span-1">
                            <dt className="text-sm font-medium text-foreground/60">
                              <div className="flex items-center gap-1">
                                <span>
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger aria-label="more information">
                                      <Info
                                        className="text-foreground/60"
                                        size={16}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent
                                      className="max-w-[200px] p-2"
                                      side="right"
                                    >
                                      {flagsTooltips[key]}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </dt>
                            <dd className="mt-1 text-sm text-foreground">
                              {value ? "Yes" : "No"}
                            </dd>
                          </div>
                        )
                      )}
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
                  <CardDescription>
                    Raw JSON data from the evaluation process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JsonEditor
                    className="!w-full !min-w-none !max-w-none !bg-background"
                    data={evaluation}
                    theme={
                      resolvedTheme === "dark"
                        ? githubDarkTheme
                        : githubLightTheme
                    }
                    restrictAdd
                    restrictDelete
                    restrictEdit
                    collapse={false}
                    showCollectionCount="when-closed"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button variant="outline" href="/eeat-checker">
              Try a new EEAT Check
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
