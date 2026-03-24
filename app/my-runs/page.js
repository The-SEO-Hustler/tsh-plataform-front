"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/container";
import { useFirebase } from "@/lib/firebase-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPathname } from "@/lib/getpathname";

const SOURCES = [
  { collection: "seoAnalyses", type: "seo-check", label: "SEO Check" },
  {
    collection: "keywordAnalysis",
    type: "advanced-keyword-analysis",
    label: "Advanced Keyword Analysis",
  },
  {
    collection: "contentPlanning",
    type: "content-planning",
    label: "Content Planning",
  },
  { collection: "searchIntent", type: "search-intent", label: "Search Intent" },
  { collection: "evaluations", type: "evaluation", label: "E-E-A-T Checker" },
  { collection: "llmstxt", type: "llmstxt", label: "LLMs.txt" },
];

export default function MyRunsPage() {
  const { user, authLoading } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setRuns([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const all = [];
        for (const source of SOURCES) {
          const q = query(
            collection(db, source.collection),
            where("userId", "==", user.uid),
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            all.push({
              id: docSnap.id,
              collection: source.collection,
              type: data?.type || source.type,
              label: source.label,
              status: data?.status || "pending",
              title: data?.url || data?.keyword || data?.query || source.label,
              createdAt: data?.createdAt?.toDate?.() || null,
            });
          });
        }
        setRuns(all);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authLoading, user?.uid]);

  const sortedRuns = useMemo(() => {
    return [...runs].sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt ? b.createdAt.getTime() : 0;
      return bTime - aTime;
    });
  }, [runs]);

  return (
    <main className="py-10 min-h-[70vh]">
      <Container className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Runs</h1>
          <p className="text-foreground/80 mt-1">
            History of analyses created with your account.
          </p>
        </div>

        {!user && !authLoading && (
          <div className="p-4 rounded-lg border border-border bg-card">
            <p className="text-foreground/80">
              You need to log in with Google to view your previous runs.
            </p>
            <Link
              href="/login"
              className="text-primary underline mt-2 inline-block"
            >
              Go to login
            </Link>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-card animate-pulse"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-foreground/10" />
                    <div className="h-3 w-2/3 rounded bg-foreground/10" />
                  </div>
                  <div className="shrink-0 space-y-2">
                    <div className="h-3 w-16 rounded bg-foreground/10 ml-auto" />
                    <div className="h-3 w-24 rounded bg-foreground/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && user && sortedRuns.length === 0 && (
          <p className="text-foreground/80">
            No runs found for this account yet.
          </p>
        )}

        {!loading && sortedRuns.length > 0 && (
          <div className="space-y-3">
            {sortedRuns.map((run) => (
              <Link
                key={`${run.collection}-${run.id}`}
                href={`${getPathname(run.type)}/result?id=${run.id}`}
                className="block p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors no-underline"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{run.label}</p>
                    <p className="text-sm text-foreground/80 truncate">
                      {run.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs capitalize">{run.status}</p>
                    <p className="text-xs text-foreground/70">
                      {run.createdAt
                        ? run.createdAt.toLocaleString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
