/**
 * Shared SEO Check category grouping (PDF, SeoCheck UI, sidebar).
 * Kept separate from config.js so PDF bundle does not pull all card components.
 */
export const categoryMap = {
  "On-Page SEO & Content": [
    "title",
    "meta-description",
    "h1",
    "h2Tags",
    "headings",
    "socialTags",
    "keywordAnalysis",
    "contentQuality",
    "linkTextQuality",
    "seo-url",
    "mobileCheck",
  ],
  "Performance & Speed": [
    "coreWebVitals",
    "site-loading-speed",
    "network-requests",
    "js-execution-time",
    "noJsParity",
    "domSizeCheck",
    "htmlSizeCheck",
    "htmlCompression",
    "cacheCheck",
    "cdnCheck",
    "requestCountCheck",
  ],

  "Technical SEO & Architecture": [
    "structuredData",
    "canonicalCheck",
    "hreflangCheck",
    "robotsTxt",
    "sitemapCheck",
    "redirectChain",
    "brokenLinksCheck",
  ],
  "Media & Assets": [
    "image-responsiveness",
    "modernMedia",
    "image-alt",
    "brokenImages",
  ],
  "Security & Diagnostics": [
    "consoleErrorsCheck",
    "securityHeaders",
    "analyticsGtmCheck",
    "inlineCss",
    "deprecatedHtml",
    "charsetCheck",
    "faviconCheck",
    "flashCheck",
  ],
};

export const cardCategoryByType = Object.entries(categoryMap).reduce(
  (acc, [label, types]) => {
    types.forEach((t) => {
      acc[t] = label;
    });
    return acc;
  },
  {},
);
