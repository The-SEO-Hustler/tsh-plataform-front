import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  categoryMap,
  cardCategoryByType,
} from "@/lib/seo-check-category-map";
import { getPathname } from "@/lib/getpathname";

const COLORS = {
  primary: "#fbbf24",
  dark: "#111827",
  gray: "#374151",
  lightGray: "#f3f4f6",
  muted: "#6b7280",
  success: "#10b981",
  successBg: "#d1fae5",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  error: "#ef4444",
  errorBg: "#fee2e2",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    color: COLORS.gray,
    fontSize: 10,
  },
  cover: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },
  brand: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 12,
    textAlign: "center",
  },
  coverUrl: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 28,
    textAlign: "center",
    maxWidth: 480,
  },
  scoreRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.dark,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  scoreText: { color: COLORS.primary, fontSize: 32, fontWeight: "bold" },
  scoreSub: { fontSize: 11, color: COLORS.muted, marginTop: 6 },
  coverLink: { fontSize: 10, color: COLORS.primary, marginTop: 28 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: 10,
    marginBottom: 16,
  },
  headerUrl: { fontSize: 9, color: COLORS.muted, maxWidth: "62%" },
  headerRight: { fontSize: 9, color: COLORS.muted, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 14,
    lineHeight: 1.5,
  },
  recCard: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  recTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginRight: 6,
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 9,
    color: COLORS.gray,
    lineHeight: 1.45,
  },
  stepsTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 6,
    marginBottom: 4,
  },
  stepLine: { fontSize: 8, color: COLORS.gray, marginBottom: 2, lineHeight: 1.35 },
  categoryHeading: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  auditRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  auditLeft: { width: "28%" },
  auditRight: { width: "72%", paddingLeft: 10 },
  auditTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.dark,
    textTransform: "capitalize",
  },
  auditDesc: {
    fontSize: 9,
    color: COLORS.gray,
    lineHeight: 1.45,
  },
  summaryBox: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
  },
  summaryLine: { fontSize: 9, color: COLORS.gray, marginBottom: 4, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: COLORS.muted,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 8,
  },
});

function getBadgeColors(status) {
  const s = String(status || "").toLowerCase();
  if (s === "error" || s === "high" || s === "critical") {
    return { backgroundColor: COLORS.errorBg, color: COLORS.error };
  }
  if (s === "warning" || s === "medium") {
    return { backgroundColor: COLORS.warningBg, color: COLORS.warning };
  }
  if (s === "low") {
    return { backgroundColor: COLORS.successBg, color: COLORS.success };
  }
  return { backgroundColor: COLORS.successBg, color: COLORS.success };
}

function formatCheckType(type) {
  if (!type || typeof type !== "string") return "Check";
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .trim();
}

const ANALYSIS_MAX = 1200;

function humanAnalysis(card) {
  const a = card?.analysis;
  if (a == null || a === "") return "—";
  if (typeof a === "string") {
    const t = a.trim();
    return t.length > ANALYSIS_MAX ? `${t.slice(0, ANALYSIS_MAX)}…` : t;
  }
  if (typeof a === "object" && a !== null) {
    if (typeof a.message === "string") return String(a.message).slice(0, ANALYSIS_MAX);
    if (typeof a.summary === "string") return String(a.summary).slice(0, ANALYSIS_MAX);
    return "See the full report online for technical details.";
  }
  const s = String(a);
  return s.length > ANALYSIS_MAX ? `${s.slice(0, ANALYSIS_MAX)}…` : s;
}

function normalizeRecommendations(raw) {
  const recs = Array.isArray(raw) ? raw : [];
  return recs.map((rec) => {
    if (typeof rec === "string") {
      return {
        priority: 0,
        title: rec,
        impact: undefined,
        effort: undefined,
        description: "",
        steps: [],
      };
    }
    const title = rec?.title || rec?.recommendation || "Recommendation";
    return {
      priority: typeof rec?.priority === "number" ? rec.priority : 0,
      title,
      impact: rec?.impact,
      effort: rec?.effort,
      description: typeof rec?.description === "string" ? rec.description : "",
      steps: Array.isArray(rec?.steps) ? rec.steps : [],
    };
  });
}

function sortRecommendations(list) {
  const hasPriority = list.some((r) => (r.priority || 0) > 0);
  if (!hasPriority) return list;
  return [...list].sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

function severityRank(status) {
  const s = (status || "normal").toLowerCase();
  if (s === "error") return 0;
  if (s === "warning") return 1;
  return 2;
}

function groupAuditByCategory(data) {
  const list = Array.isArray(data) ? data : [];
  const groups = {};
  Object.keys(categoryMap).forEach((label) => {
    groups[label] = [];
  });
  const additional = [];

  list.forEach((card) => {
    const label = cardCategoryByType[card.type];
    if (label && groups[label]) {
      groups[label].push(card);
    } else {
      additional.push(card);
    }
  });

  const ordered = Object.keys(categoryMap).map((label) => ({
    label,
    cards: [...groups[label]].sort(
      (a, b) => severityRank(a.status) - severityRank(b.status),
    ),
  }));

  if (additional.length > 0) {
    ordered.push({
      label: "Additional checks",
      cards: [...additional].sort(
        (a, b) => severityRank(a.status) - severityRank(b.status),
      ),
    });
  }

  return ordered.filter((g) => g.cards.length > 0);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out.length ? out : [[]];
}

function resultUrl(meta) {
  const base =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_FRONT_URL &&
      String(process.env.NEXT_PUBLIC_FRONT_URL).replace(/\/$/, "")) ||
    "https://theseohustler.com";
  if (meta?.docId) {
    return `${base}${getPathname("seo-check")}/result?id=${meta.docId}`;
  }
  return null;
}

function formatReportDate(meta) {
  try {
    if (meta?.updatedAt?.seconds) {
      return format(new Date(meta.updatedAt.seconds * 1000), "MMMM d, yyyy");
    }
  } catch {
    /* ignore */
  }
  return format(new Date(), "MMMM d, yyyy");
}

function Footer({ dateStr }) {
  return (
    <Text style={styles.footer}>
      Generated by The SEO Hustler · {dateStr}
    </Text>
  );
}

const RECS_PER_PAGE = 6;
const AUDIT_ROWS_PER_PAGE = 5;

export default function PDFReport({ data, score, meta }) {
  const dateStr = formatReportDate(meta);
  const url = meta?.url || "—";
  const scoreDisplay =
    score !== null && score !== undefined && score !== ""
      ? String(score)
      : "—";
  const onlineUrl = resultUrl(meta);
  const recommendations = sortRecommendations(
    normalizeRecommendations(meta?.recommendations),
  );
  const recPages = chunk(recommendations, RECS_PER_PAGE);
  const categoryGroups = groupAuditByCategory(data);
  const diff = meta?.diff;

  const pages = [];

  pages.push(
    <Page key="cover" size="A4" style={styles.page}>
      <View style={styles.cover}>
        <Text style={styles.brand}>The SEO Hustler</Text>
        <Text style={styles.coverTitle}>SEO Audit Report</Text>
        <Text style={styles.coverUrl}>{url}</Text>
        <View style={styles.scoreRing}>
          <Text style={styles.scoreText}>{scoreDisplay}</Text>
        </View>
        <Text style={styles.scoreSub}>Overall SEO health score (0–100)</Text>
        <Text style={styles.scoreSub}>Generated {dateStr}</Text>
        {onlineUrl ? (
          <Link src={onlineUrl} style={styles.coverLink}>
            View full interactive report online
          </Link>
        ) : null}
      </View>
      <Footer dateStr={dateStr} />
    </Page>,
  );

  if (diff && (diff.scoreChange != null || (diff.improvedChecks || []).length)) {
    pages.push(
      <Page key="summary" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerUrl}>{url}</Text>
          <Text style={styles.headerRight}>Executive summary</Text>
        </View>
        <Text style={styles.sectionTitle}>Compared to previous run</Text>
        <View style={styles.summaryBox}>
          {diff.scoreChange != null ? (
            <Text style={styles.summaryLine}>
              Score change: {diff.scoreChange > 0 ? "+" : ""}
              {diff.scoreChange} points
            </Text>
          ) : null}
          {Array.isArray(diff.improvedChecks) && diff.improvedChecks.length > 0 ? (
            <Text style={styles.summaryLine}>
              Improved: {diff.improvedChecks.join(", ")}
            </Text>
          ) : null}
          {Array.isArray(diff.regressedChecks) && diff.regressedChecks.length > 0 ? (
            <Text style={styles.summaryLine}>
              Regressed: {diff.regressedChecks.join(", ")}
            </Text>
          ) : null}
        </View>
        <Footer dateStr={dateStr} />
      </Page>,
    );
  }

  if (recommendations.length > 0) {
    recPages.forEach((slice, pi) => {
      pages.push(
        <Page key={`rec-${pi}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerUrl}>{url}</Text>
            <Text style={styles.headerRight}>Action plan</Text>
          </View>
          <Text style={styles.sectionTitle}>Prioritized recommendations</Text>
          <Text style={styles.sectionSubtitle}>
            Focus on high-impact items first. This plan reflects AI-prioritized
            fixes for your site.
          </Text>
          {slice.map((rec, idx) => {
            const n = pi * RECS_PER_PAGE + idx + 1;
            return (
              <View key={idx} style={styles.recCard} wrap={false}>
                <Text style={styles.recTitle}>
                  {n}. {rec.title}
                </Text>
                <View style={styles.badgeRow}>
                  {rec.impact ? (
                    <Text style={[styles.badge, getBadgeColors(rec.impact)]}>
                      {String(rec.impact).toUpperCase()} impact
                    </Text>
                  ) : null}
                  {rec.effort ? (
                    <Text style={[styles.badge, getBadgeColors(rec.effort)]}>
                      {String(rec.effort).toUpperCase()} effort
                    </Text>
                  ) : null}
                </View>
                {rec.description ? (
                  <Text style={styles.recDesc}>{rec.description}</Text>
                ) : (
                  <Text style={styles.recDesc}>
                    Review this item in the interactive report for full context
                    and next steps.
                  </Text>
                )}
                {rec.steps.length > 0 ? (
                  <>
                    <Text style={styles.stepsTitle}>Suggested steps</Text>
                    {rec.steps.slice(0, 5).map((step, si) => (
                      <Text key={si} style={styles.stepLine}>
                        •{" "}
                        {typeof step === "string"
                          ? step
                          : "See interactive report for details"}
                      </Text>
                    ))}
                  </>
                ) : null}
              </View>
            );
          })}
          <Footer dateStr={dateStr} />
        </Page>,
      );
    });
  }

  categoryGroups.forEach((group) => {
    const rows = chunk(group.cards, AUDIT_ROWS_PER_PAGE);
    rows.forEach((rowSlice, ri) => {
      pages.push(
        <Page
          key={`audit-${group.label}-${ri}`}
          size="A4"
          style={styles.page}
        >
          <View style={styles.header}>
            <Text style={styles.headerUrl}>{url}</Text>
            <Text style={styles.headerRight}>Detailed audit</Text>
          </View>
          {ri === 0 ? (
            <Text style={styles.categoryHeading}>{group.label}</Text>
          ) : (
            <Text style={styles.categoryHeading}>
              {group.label} (continued)
            </Text>
          )}
          {rowSlice.map((card, idx) => (
            <View
              key={`${card.type}-${ri}-${idx}`}
              style={styles.auditRow}
              wrap={false}
            >
              <View style={styles.auditLeft}>
                <Text style={styles.auditTitle}>
                  {formatCheckType(card.type)}
                </Text>
                <View style={{ marginTop: 4 }}>
                  <Text
                    style={[
                      styles.badge,
                      getBadgeColors(card.status || "normal"),
                    ]}
                  >
                    {(card.status || "normal").toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.auditRight}>
                <Text style={styles.auditDesc}>{humanAnalysis(card)}</Text>
              </View>
            </View>
          ))}
          <Footer dateStr={dateStr} />
        </Page>,
      );
    });
  });

  if (categoryGroups.length === 0 && recommendations.length === 0) {
    pages.push(
      <Page key="empty" size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerUrl}>{url}</Text>
          <Text style={styles.headerRight}>Detailed audit</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          No audit card data was available for this export.
        </Text>
        <Footer dateStr={dateStr} />
      </Page>,
    );
  }

  return <Document>{pages}</Document>;
}
