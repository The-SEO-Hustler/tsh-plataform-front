"use client";

import React, { useState, useEffect, Suspense } from "react";
import Container from "@/components/container";
import s from "./style.module.css";
import Sidebar from "@/components/sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  DollarSign,
  Globe,
  ImageIcon,
  Lock,
  Server,
  Share2,
  Gauge,
  Code,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import LoadingScreen from "../components/LoadingScreen";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

function getStatusForData(data, cardId) {
  switch (cardId) {
    case "meta":
      if (!data.ogDescription) return "error";
      return "normal";
    case "headings":
      // Example: Check for missing H1
      if (!data.find((item) => item.name === "H1")) return "warning";
      return "normal";
    case "links":
      // Example: Check for too many external links
      if (data.find((item) => item.name === "External").value > 20)
        return "warning";
      return "normal";
    // Add more cases for other cards as needed
    default:
      return "normal";
  }
}

function getCardDescription(data, cardId) {
  switch (cardId) {
    case "headings":
      if (!data.find((item) => item.name === "H1")) {
        return "Warning: Missing H1 heading. This is crucial for SEO as it indicates the main topic of the page.";
      }
      return "Heading structure looks good with proper hierarchy.";
    case "links":
      const externalLinks = data.find((item) => item.name === "External").value;
      if (externalLinks > 20) {
        return `Warning: High number of external links (${externalLinks}). This might dilute your page's authority.`;
      }
      return "Link distribution is balanced between internal and external links.";
    case "meta":
      if (!data.ogDescription) {
        return "Error: Missing Open Graph description. This affects social media sharing appearance.";
      }
      return "Meta information is properly configured.";
    case "keywords":
      return "Top keywords are well-distributed throughout the content.";
    case "metaRobots":
      return "Robots directives are properly set for search engine crawling.";
    case "sitemap":
      return data
        ? "Sitemap is present and properly configured."
        : "Warning: Missing sitemap. This may affect search engine indexing.";
    case "socialTags":
      return "Social media tags are properly configured for optimal sharing.";
    case "searchPreview":
      return "Search result preview looks good with proper title and description.";
    case "keywordDensity":
      return "Keyword density is within optimal range.";
    case "competitors":
      return "Competitor analysis shows good market positioning.";
    case "urlStructure":
      return data.friendly
        ? "URL structure is SEO-friendly."
        : "Warning: URL structure could be more SEO-friendly.";
    case "imageAnalysis":
      return "Images are properly optimized with alt tags.";
    case "inlineCSS":
      return "Code structure analysis shows some inline styles that could be moved to external CSS.";
    case "gaTracking":
      return data.exists
        ? "Analytics tracking is properly configured."
        : "Warning: Missing analytics tracking.";
    case "favicon":
      return data.exists ? "Favicon is present." : "Warning: Missing favicon.";
    default:
      return "";
  }
}

const statusClasses = {
  error:
    "!bg-red-100 text-red-500 hover:bg-red-200 [& .cardHeading]:border-b-red-500",
  warning:
    "!bg-yellow-100 text-yellow-700 hover:bg-yellow-200 [& .cardHeading]:border-b-yellow-700",
  normal: "[& .cardHeading]:border-b-gray-300",
};

function SEOAudit() {
  const [focusedCardId, setFocusedCardId] = useState(null);
  const score = 75;
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  useEffect(() => {
    const fetchAnalysisData = async () => {
      console.log("hello", url);
      try {
        const response = await fetch(`/api/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();
        console.log("hello", data);
        // setAnalysisData(data);
        // localStorage.setItem('seoAnalysisData', JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching analysis:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysisData();
  }, [url]);

  // Existing mock data

  const headingData = [
    { name: "H1", count: 1 },
    { name: "H2", count: 5 },
    { name: "H3", count: 8 },
    { name: "H4", count: 3 },
  ];

  const linkData = [
    { name: "Internal", value: 24 },
    { name: "External", value: 42 },
  ];

  const keywordData = [
    { keyword: "seo", count: 15 },
    { keyword: "analysis", count: 12 },
    { keyword: "marketing", count: 8 },
    { keyword: "traffic", count: 6 },
  ];

  // Additional mock data

  // Meta Robots / Directives
  const metaRobots = {
    index: "index",
    follow: "follow",
    ogDescription: null,
  };

  // Sitemap presence
  const sitemapPresence = true;

  // Social Tags
  const socialTags = {
    ogTitle: "Example OG Title",
    ogDescription: "Example OG Description",
    twitterCard: "summary_large_image",
  };

  // Google Search Results Preview
  const searchPreview = {
    title: "Example Page Title",
    description: "Example meta description for search preview.",
    url: "https://example.com",
  };

  // Keyword Usage & Density
  const keywordDensityData = [
    { keyword: "seo", density: 3.2 },
    { keyword: "analysis", density: 2.5 },
    { keyword: "marketing", density: 1.8 },
    { keyword: "traffic", density: 1.2 },
  ];

  // Competitor Domains
  const competitorData = [
    { domain: "competitor1.com", similarity: "85%" },
    { domain: "competitor2.com", similarity: "78%" },
    { domain: "competitor3.com", similarity: "65%" },
  ];

  // Technical SEO - URL structure
  const technicalUrl = {
    url: "https://example.com/seo-friendly-url",
    friendly: true,
  };

  // Image Analysis
  const imageAnalysisData = [
    { src: "/img1.jpg", alt: "Image 1 Alt", aspectRatio: "16:9" },
    { src: "/img2.jpg", alt: "Image 2 Alt", aspectRatio: "4:3" },
  ];

  // Inline CSS & Deprecated HTML Tags
  const inlineCssData = [
    { element: "div", issue: "inline style found", severity: "warning" },
    { element: "font", issue: "deprecated tag", severity: "fail" },
  ];

  // Google Analytics & Tracking Code Checks
  const gaTracking = { exists: true };

  // Favicon presence
  const favicon = { exists: true };

  // Colors for Pie Charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Prepare data for react-chartjs-2 charts
  const headingsChartData = {
    labels: headingData.map((d) => d.name),
    datasets: [
      {
        label: "Count",
        data: headingData.map((d) => d.count),
        backgroundColor: "#8884d8",
      },
    ],
  };

  const linksChartData = {
    labels: linkData.map((d) => d.name),
    datasets: [
      {
        label: "Links",
        data: linkData.map((d) => d.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const keywordsChartData = {
    labels: keywordData.map((d) => d.keyword),
    datasets: [
      {
        label: "Count",
        data: keywordData.map((d) => d.count),
        backgroundColor: "#82ca9d",
      },
    ],
  };

  const keywordDensityChartData = {
    labels: keywordDensityData.map((d) => d.keyword),
    datasets: [
      {
        label: "Density",
        data: keywordDensityData.map((d) => d.density),
        borderColor: "#ff7300",
        backgroundColor: "rgba(255, 115, 0, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart options (for centering labels and data)
  const commonOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        bodyFont: { size: 12 },
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 20,
      },
    },
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <div
        className={`${s.overlay} ${focusedCardId ? s.active : ""}`}
        onClick={() => setFocusedCardId(null)}
      ></div>
      <div className={s.dashboard}>
        <div className="pt-4">
          <Sidebar setFocusedCardId={setFocusedCardId} />
        </div>
        <div className="p-4">
          {/* Header */}
          <div className="flex flex-col gap-2 md:flex-row items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                SEO Analysis Dashboard
              </h1>
              <p className="text-muted-foreground">
                Overall Score: {score}/100
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-lg">
                Export Report
              </button>
              <button className="px-4 py-2 border rounded-lg">
                Refresh Analysis
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="gap-2.5 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {/* Headings Analysis */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(headingData, "headings")]
              } ${focusedCardId === "headings" ? s.focused : ""}`}
              id="headings"
            >
              <div>
                <div
                  className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
                >
                  <Code className="w-5 h-5" />
                  <h3 className="font-semibold">Headings Structure</h3>
                </div>
                <div className="w-full h-[200px] mt-4">
                  <Bar data={headingsChartData} options={commonOptions} />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(headingData, "headings")}
              </p>
            </div>

            {/* Links Analysis */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(linkData, "links")]
              } ${focusedCardId === "links" ? s.focused : ""}`}
              id="links"
            >
              <div>
                <div
                  className={`flex items-center gap-3 pb-3 mb-3 border-bborder-gray-100 cardHeading`}
                >
                  <Share2 className="w-5 h-5" />
                  <h3 className="font-semibold">Links Distribution</h3>
                </div>
                <div className="w-full h-[200px] mt-4">
                  <Pie data={linksChartData} options={commonOptions} />
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(linkData, "links")}
              </p>
            </div>

            {/* Meta Information */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(metaRobots, "meta")]
              } ${focusedCardId === "meta" ? s.focused : ""}`}
              id="meta"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Globe className="w-5 h-5" />
                <h3 className="font-semibold">Meta Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Title Tag</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Meta Description</span>
                  <span className="text-red-500">x</span>
                </div>
                <div className="flex justify-between">
                  <span>Robots.txt</span>
                  <span className="text-green-500">✓</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(metaRobots, "meta")}
              </p>
            </div>

            {/* Top Keywords */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(keywordData, "keywords")]
              } ${focusedCardId === "keywords" ? s.focused : ""}`}
              id="keywords"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Gauge className="w-5 h-5" />
                <h3 className="font-semibold">Top Keywords</h3>
              </div>
              <div className="w-full h-[200px] mt-4">
                <Bar data={keywordsChartData} options={commonOptions} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(keywordData, "keywords")}
              </p>
            </div>
            {/* Meta Robots / Directives */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(metaRobots, "metaRobots")]
              } ${focusedCardId === "metaRobots" ? s.focused : ""}`}
              id="metaRobots"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <Lock className="w-5 h-5" />
                <h3 className="font-semibold">Meta Robots / Directives</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Index</td>
                    <td className="text-right py-2">{metaRobots.index}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Follow</td>
                    <td className="text-right py-2">{metaRobots.follow}</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(metaRobots, "metaRobots")}
              </p>
            </div>

            {/* Sitemap Presence */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(sitemapPresence, "sitemap")]
              } ${focusedCardId === "sitemap" ? s.focused : ""}`}
              id="sitemap"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <Server className="w-5 h-5" />
                <h3 className="font-semibold">Sitemap Presence</h3>
              </div>
              <p className="text-center text-lg">
                {sitemapPresence ? "Present ✓" : "Missing ✕"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(sitemapPresence, "sitemap")}
              </p>
            </div>

            {/* Social Tags */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(socialTags, "socialTags")]
              } ${focusedCardId === "socialTags" ? s.focused : ""}`}
              id="socialTags"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-semibold">Social Tags</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b ">
                    <td className="py-2">OG Title</td>
                    <td className="text-right py-2">{socialTags.ogTitle}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">OG Description</td>
                    <td className="text-right py-2">
                      {socialTags.ogDescription}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Twitter Card</td>
                    <td className="text-right py-2">
                      {socialTags.twitterCard}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(socialTags, "socialTags")}
              </p>
            </div>

            {/* Google Search Results Preview */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(searchPreview, "searchPreview")]
              } ${focusedCardId === "searchPreview" ? s.focused : ""}`}
              id="searchPreview"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <Globe className="w-5 h-5" />
                <h3 className="font-semibold">Google Search Preview</h3>
              </div>
              <div className="border p-3 rounded bg-white">
                <h4 className="text-blue-600">{searchPreview.title}</h4>
                <p className="text-sm">{searchPreview.description}</p>
                <p className="text-xs text-gray-500">{searchPreview.url}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(searchPreview, "searchPreview")}
              </p>
            </div>
            {/* Keyword Density (Usage) */}
            <div
              className={`${s.card} ${
                statusClasses[
                  getStatusForData(keywordDensityData, "keywordDensity")
                ]
              } ${focusedCardId === "keywordDensity" ? s.focused : ""}`}
              id="keywordDensity"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Gauge className="w-5 h-5" />
                <h3 className="font-semibold">Keyword Density</h3>
              </div>
              <div className="w-full h-[200px] mt-4">
                <Line data={keywordDensityChartData} options={commonOptions} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(keywordDensityData, "keywordDensity")}
              </p>
            </div>

            {/* Competitor Domains */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(competitorData, "competitors")]
              } ${focusedCardId === "competitors" ? s.focused : ""}`}
              id="competitors"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <DollarSign className="w-5 h-5" />
                <h3 className="font-semibold">Competitor Domains</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Domain</th>
                    <th className="text-right py-2">Similarity</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.map((comp, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{comp.domain}</td>
                      <td className="text-right py-2">{comp.similarity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(competitorData, "competitors")}
              </p>
            </div>

            {/* SEO-friendly URL Structure */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(technicalUrl, "urlStructure")]
              } ${focusedCardId === "urlStructure" ? s.focused : ""}`}
              id="urlStructure"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Globe className="w-5 h-5" />
                <h3 className="font-semibold">URL Structure</h3>
              </div>
              <p className="text-sm">
                URL:{" "}
                <a href={technicalUrl.url} className="text-blue-500">
                  {technicalUrl.url}
                </a>
              </p>
              <p className="text-center mt-2 text-lg">
                {technicalUrl.friendly
                  ? "SEO-friendly ✓"
                  : "Not SEO-friendly ✕"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(technicalUrl, "urlStructure")}
              </p>
            </div>

            {/* Image Analysis */}
            <div
              className={`${s.card} ${
                statusClasses[
                  getStatusForData(imageAnalysisData, "imageAnalysis")
                ]
              } ${focusedCardId === "imageAnalysis" ? s.focused : ""}`}
              id="imageAnalysis"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-semibold">Image Analysis</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Src</th>
                    <th className="py-2">Alt</th>
                    <th className="py-2">Aspect Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {imageAnalysisData.map((img, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{img.src}</td>
                      <td className="py-2">{img.alt}</td>
                      <td className="py-2">{img.aspectRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(imageAnalysisData, "imageAnalysis")}
              </p>
            </div>

            {/* Inline CSS & Deprecated HTML Tags */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(inlineCssData, "inlineCSS")]
              } ${focusedCardId === "inlineCSS" ? s.focused : ""}`}
              id="inlineCSS"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Code className="w-5 h-5" />
                <h3 className="font-semibold">Inline CSS / Deprecated Tags</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Element</th>
                    <th className="py-2">Issue</th>
                    <th className="py-2">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {inlineCssData.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.element}</td>
                      <td className="py-2">{item.issue}</td>
                      <td className="py-2">{item.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(inlineCssData, "inlineCSS")}
              </p>
            </div>

            {/* Google Analytics & Tracking Code */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(gaTracking, "gaTracking")]
              } ${focusedCardId === "gaTracking" ? s.focused : ""}`}
              id="gaTracking"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Server className="w-5 h-5" />
                <h3 className="font-semibold">Analytics & Tracking</h3>
              </div>
              <p className="text-center text-lg">
                {gaTracking.exists
                  ? "Tracking Code Found ✓"
                  : "Missing Tracking Code ✕"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(gaTracking, "gaTracking")}
              </p>
            </div>

            {/* Favicon Presence */}
            <div
              className={`${s.card} ${
                statusClasses[getStatusForData(favicon, "favicon")]
              } ${focusedCardId === "favicon" ? s.focused : ""}`}
              id="favicon"
            >
              <div
                className={`flex items-center gap-3 pb-3 mb-3 border-b border-gray-100 cardHeading`}
              >
                <Globe className="w-5 h-5" />
                <h3 className="font-semibold">Favicon</h3>
              </div>
              <p className="text-center text-lg">
                {favicon.exists ? "Favicon Present ✓" : "Favicon Missing ✕"}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getCardDescription(favicon, "favicon")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function SEOAuditPage() {
  return (
    <Suspense>
      <SEOAudit />
    </Suspense>
  );
}
