"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { statusMessages } from "@/lib/statusMessages";
import { Loader2, Copy, Mail, Bell } from "lucide-react";
import { getPathname } from "@/lib/getpathname";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  collection as fsCollection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Container from "./container";
import Image from "next/image";

// Status messages with their descriptions
const STATUS_TO_PERCENT = {
  processing: 3,
  fetching: 15,
  analyzing_meta: 42,
  analyzing_images: 58,
  analyzing_robots: 65,
  analyzing_performance: 88,
  analyzing_links: 95,
  compiling_results: 98,
  completed: 100,
  failed: 100,
};

const STAGE_CHECK_TOTALS = {
  analyzing_meta: 18,
  analyzing_images: 10,
  analyzing_robots: 2,
  analyzing_performance: 5,
  analyzing_links: 4,
};

const STAGE_RANGES = {
  analyzing_meta: [22, 42],
  analyzing_images: [42, 58],
  analyzing_robots: [58, 65],
  analyzing_performance: [65, 88],
  analyzing_links: [88, 95],
};

function percentFromStatus(status) {
  return STATUS_TO_PERCENT[status] ?? 8;
}

function computeProgress(status, events) {
  if (status === "completed" || status === "failed") return 100;

  const base = percentFromStatus(status);
  const stageTotal = STAGE_CHECK_TOTALS[status];
  const stageRange = STAGE_RANGES[status];

  if (!stageTotal || !stageRange || !Array.isArray(events)) return base;

  const finishedInStage = events.filter(
    (event) =>
      event?.check &&
      typeof event?.message === "string" &&
      event.message.toLowerCase().includes("finished"),
  ).length;

  const ratio = Math.max(0, Math.min(1, finishedInStage / stageTotal));
  const [start, end] = stageRange;
  const smooth = Math.round(start + (end - start) * ratio);

  return Math.max(base, smooth);
}

function subscribeSeoProgress(docId, handlers) {
  const analysisRef = doc(db, "seoAnalyses", docId);
  const eventsQuery = query(
    fsCollection(db, "seoAnalyses", docId, "events"),
    orderBy("createdAt", "asc"),
  );

  const unsubAnalysis = onSnapshot(analysisRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.data() : null;
    handlers?.onAnalysis?.(data);
  });

  const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
    const events = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    handlers?.onEvents?.(events);
  });

  return () => {
    unsubAnalysis();
    unsubEvents();
  };
}

export default function LoadingScreen({
  status = "pending",
  type,
  docId,
  collection,
  sendToEmail,
  blogPosts = null,
  currentUrl,
}) {
  const decodeHtmlEntities = (str) => {
    if (typeof str !== "string" || !str) return str || "";

    // Decode a few common named entities first
    let decoded = str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'");

    // Decode numeric entities like &#8217;
    decoded = decoded.replace(/&#(\d+);/g, (_, code) => {
      const num = parseInt(code, 10);
      return Number.isFinite(num) ? String.fromCharCode(num) : _;
    });

    return decoded;
  };

  // Get the message for the current status, or use the default 'pending' message
  const message = statusMessages[status] || statusMessages["pending"];
  const searchParams = useSearchParams();

  // State to track the progress bar animation
  const [progress, setProgress] = useState(0);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  // Email notification states
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(sendToEmail || false);
  const [showBlogPosts, setShowBlogPosts] = useState(false);
  const [seoConsoleLines, setSeoConsoleLines] = useState([]);
  const [seoAnalysis, setSeoAnalysis] = useState(null);
  const [seoLiveStatus, setSeoLiveStatus] = useState("");
  const [isConsoleAutoScrollEnabled, setIsConsoleAutoScrollEnabled] =
    useState(true);
  const seoConsoleContainerRef = useRef(null);
  const isSeoCheck = type === "seo-check";

  // Load email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);
  useEffect(() => {
    setEmailSubmitted(sendToEmail || false);
  }, [sendToEmail]);

  // Show blog posts after 3 seconds
  useEffect(() => {
    if (blogPosts && blogPosts.length > 0) {
      const timer = setTimeout(() => {
        setShowBlogPosts(true);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [blogPosts]);

  useEffect(() => {
    if (!isSeoCheck || !docId) return;

    return subscribeSeoProgress(docId, {
      onAnalysis: (analysisData) => {
        setSeoAnalysis(analysisData);
        setSeoLiveStatus(analysisData?.status || "");
      },
      onEvents: (events) => {
        const lines = events.map((event) => {
          const createdAtValue = event?.createdAt;
          return {
            id: event.id,
            level: event?.level || "info",
            message: event?.message || "",
            check: event?.check || "",
            createdAt: createdAtValue?.toDate?.() || null,
          };
        });
        setSeoConsoleLines(lines);
      },
    });
  }, [docId, isSeoCheck]);

  useEffect(() => {
    if (!isSeoCheck) return;

    const computedProgress = computeProgress(seoLiveStatus, seoConsoleLines);
    setProgress((prev) => Math.max(prev, computedProgress));
  }, [isSeoCheck, seoConsoleLines, seoLiveStatus]);

  useEffect(() => {
    if (!isSeoCheck) {
      setIsConsoleAutoScrollEnabled(true);
      return;
    }

    const container = seoConsoleContainerRef.current;
    if (!container) return;

    const handleConsoleScroll = () => {
      const distanceToBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setIsConsoleAutoScrollEnabled(distanceToBottom < 24);
    };

    container.addEventListener("scroll", handleConsoleScroll);
    return () => {
      container.removeEventListener("scroll", handleConsoleScroll);
    };
  }, [isSeoCheck]);

  useEffect(() => {
    if (!isSeoCheck || !isConsoleAutoScrollEnabled) return;
    if (!seoConsoleContainerRef.current) return;

    seoConsoleContainerRef.current.scrollTop =
      seoConsoleContainerRef.current.scrollHeight;
  }, [isSeoCheck, isConsoleAutoScrollEnabled, seoConsoleLines]);

  // Animate the progress bar when status changes (non-SEO loaders).
  useEffect(() => {
    if (isSeoCheck) return;

    const targetProgress = message.progress;

    const duration = 1000;
    const steps = 20;
    const increment = (targetProgress - progress) / steps;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setProgress((prev) => Math.min(prev + increment, targetProgress));
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isSeoCheck, message.progress, progress]);

  // Rotate through descriptions
  const displayMessage = useMemo(() => {
    if (!isSeoCheck) return message;
    return statusMessages[seoLiveStatus] || message;
  }, [isSeoCheck, message, seoLiveStatus]);

  useEffect(() => {
    setCurrentDescriptionIndex(0);
  }, [displayMessage]);

  useEffect(() => {
    const descriptions = displayMessage?.descriptions || [];
    if (descriptions.length <= 1) return;

    const descriptionTimer = setInterval(() => {
      setCurrentDescriptionIndex((prev) => (prev + 1) % descriptions.length);
    }, 3000);

    return () => clearInterval(descriptionTimer);
  }, [displayMessage]);

  // Handle email notification submission
  const handleEmailSubmit = async (e) => {
    console.log("handleEmailSubmit", docId, collection, email);
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!docId || !collection) {
      toast.error("Unable to save email preferences");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save email to localStorage
      localStorage.setItem("userEmail", email);

      // Update Firebase document
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, {
        sendToEmail: true,
        email: email,
      });

      setEmailSubmitted(true);
      toast.success(
        "Email notification enabled! You'll receive an email when the process is complete.",
      );
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to save email preferences. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current description
  const currentDescription =
    displayMessage.descriptions[currentDescriptionIndex] ||
    displayMessage.descriptions[0];

  // Get the icon component
  const IconComponent = displayMessage.icon;
  const effectiveSeoStatus = seoLiveStatus || status;

  const seoPhaseLabel = useMemo(() => {
    if (!effectiveSeoStatus) return "waiting";
    return String(effectiveSeoStatus).replace(/_/g, " ");
  }, [effectiveSeoStatus]);

  const seoStatusBadgeClass = useMemo(() => {
    if (effectiveSeoStatus === "failed") {
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800";
    }
    if (effectiveSeoStatus === "completed") {
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800";
    }
    return "bg-foreground/10 text-foreground border-foreground/20 dark:bg-foreground/90/30 dark:text-foreground dark:border-foreground/80";
  }, [effectiveSeoStatus]);

  const levelPresentation = {
    ok: { prefix: "[OK]", color: "text-green-600 dark:text-green-400" },
    info: {
      prefix: "[INFO]",
      color: "text-gray-600 dark:text-foreground/80",
    },
    warn: { prefix: "[WARN]", color: "text-yellow-600 dark:text-yellow-400" },
    error: { prefix: "[ERR]", color: "text-red-600 dark:text-red-400" },
    done: { prefix: "[Done]", color: "text-green-600 dark:text-green-400" },
  };

  return (
    <Container className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="text-center md:max-w-md md:p-8 p-6 bg-card rounded-xl shadow-lg sm:max-w-[90%] max-w-full">
        <div className="flex justify-center relative h-20 w-20 mx-auto mb-6">
          <Loader2 className="h-20 w-20 animate-spin text-primary absolute top-0" />
          <IconComponent className="h-10 w-10 text-primary absolute top-5" />
        </div>
        {!isSeoCheck && (
          <h2 className="text-2xl font-bold mb-2">{displayMessage.title}</h2>
        )}
        {isSeoCheck && (
          <div className="mb-3">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${seoStatusBadgeClass}`}
            >
              Phase: {seoPhaseLabel}
            </span>
          </div>
        )}
        {!isSeoCheck && (
          <div className="h-16 flex items-center justify-center">
            <p className="text-foreground/80 mb-3">{currentDescription}</p>
          </div>
        )}

        {currentUrl && (
          <div className="h-16 flex items-center justify-center">
            <p className="text-foreground/80 mb-3">Analyzing {currentUrl}</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-foreground/80 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {isSeoCheck && (
          <div className="mb-6">
            <div className="text-left">
              <h3 className="text-sm font-semibold mb-2">SEO console</h3>
              <div
                ref={seoConsoleContainerRef}
                className="h-52 overflow-y-auto rounded-lg border border-border bg-zinc-950 p-3 text-xs font-mono"
              >
                {seoConsoleLines.length === 0 ? (
                  <p className="text-zinc-400">[INFO] Waiting for events...</p>
                ) : (
                  seoConsoleLines.map((line) => {
                    const level =
                      levelPresentation[line.level] || levelPresentation.info;
                    return (
                      <div
                        key={line.id}
                        className="mb-1 text-zinc-100 break-words"
                      >
                        <span className={level.color}>{level.prefix}</span>{" "}
                        <span className="text-muted-foreground/80">
                          {line.message}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Email Notification Section */}
        {!emailSubmitted && (
          <div className="mb-6 p-4 bg-background dark:bg-accent/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 min-w-5 min-h-5 text-primary" />
              <h3 className="font-semibold text-sm">
                Get notified when this process is complete
              </h3>
            </div>

            {!showEmailForm ? (
              <div className="space-y-2">
                <p className="text-xs text-foreground/70 mb-2">
                  Receive an email notification when this specific analysis is
                  finished
                </p>
                <Button
                  onClick={() => setShowEmailForm(true)}
                  variant="outline"
                  size="sm"
                  className="w-full text-foreground/80 text-sm md:text-base"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enable Email Notifications
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Enable Notifications"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-foreground/80"
                    onClick={() => setShowEmailForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {emailSubmitted && (
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">
                Email notifications enabled for this process
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 text-[11px] text-foreground/80 flex items-center gap-2">
          <p>
            This process may take a few minutes depending on the process size.
            You can leave this page and check back later in this page.
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_FRONT_URL}${getPathname(
                  type,
                )}/result?id=${searchParams.get("id")}`,
              );
              toast.success("Link to analysis copied to clipboard");
            }}
            className="cursor-pointer"
          >
            <Copy className="h-4 w-4 text-foreground/80" />
          </button>
        </div>
      </div>

      {/* TODO comment out the blog section, take a screenhot of the loading screen, try to edit it with figa and put it on seo-check hero */}
      {/* Blog Posts Section */}
      {blogPosts && blogPosts.length > 0 && (
        <div
          className={`mb-6 mt-6 lg:absolute bottom-2 right-4 max-w-md transition-all duration-700 ease-out ${
            showBlogPosts
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">
            While you wait, check out our latest articles:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.slice(0, 2).map((post, index) => (
              <Link
                key={index}
                href={`/blog/${post.slug}`}
                className="block bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group no-underline"
              >
                {/* Image Container */}
                {post.featuredImage && (
                  <div className="relative h-32 w-full bg-muted overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      className="object-cover w-full h-full"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 200px, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h4 className="text-sm font-bold mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 dark:text-foreground/70">
                    {decodeHtmlEntities(post.excerpt)}
                  </p>

                  {/* Date and Read More */}
                  <div className="flex items-center text-xs">
                    <span className="text-foreground/80">{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
