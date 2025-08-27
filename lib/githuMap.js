export const pageToFileMap = {
  "/": "/app/page.js",
  "/about": "/components/AboutPage/index.js",
  "/contact": "/components/ContactPage/index.js",
  "/free-tools": "/components/ToolsPage/index.js",
  "/resources": "/components/ResourcesPage/index.js",
  "/blog": "/components/BlogClient.js",
  "/llms-txt-generator": "/components/llmtxtHero.js",
  "/seo-check": "/components/seo-check-hero.js",
  "/advanced-keyword-analysis": "/components/advanced-keyword-analysis-hero.js",
  "/content-planning": "/components/contentPlanningHero.js",
  "/eeat-checker": "/components/EEATCheckerHero/index.js",
  "/search-intent": "/components/search-intent-hero/index.js",
  "/seo-check/result": "/components/SeoCheck/index.js",
  "/advanced-keyword-analysis/result":
    "/components/AdavancedKeywordAnalysisPage/index.js",
  "/content-planning/result": "/components/ContentPlanningPage/index.js",
  "/llms-txt-generator/result": "/components/LLMTxtResultPage/index.js",
  "/eeat-checker/result": "/components/EvaluationPage/index.js",
  "/search-intent/result": "/components/SearchIntentResult/index.js",
  "/404": "/components/notFoundLayout/index.js",
  "/terms": "/app/terms/page.js",
  "/privacy": "/app/privacy/page.js",
};

// Wildcard patterns for dynamic routes
export const wildcardPatterns = [
  {
    pattern: /^\/playbooks(\/.*)?$/,
    filePath: "/components/ResourceContentPage/index.js",
  },
  {
    pattern: /^\/spreadsheets(\/.*)?$/,
    filePath: "/components/ResourceContentPage/index.js",
  },
  {
    pattern: /^\/ebooks(\/.*)?$/,
    filePath: "/components/ResourceContentPage/index.js",
  },
  {
    pattern: /^\/blog(\/.*)?$/,
    filePath: "/components/BlogContent/index.js",
  },
];

// Helper function to find file path for a given pathname
export function getFilePathForPathname(pathname) {
  // First try exact match
  if (pageToFileMap[pathname]) {
    return pageToFileMap[pathname];
  }

  // Then try wildcard patterns
  for (const { pattern, filePath } of wildcardPatterns) {
    if (pattern.test(pathname)) {
      return filePath;
    }
  }

  return null;
}
