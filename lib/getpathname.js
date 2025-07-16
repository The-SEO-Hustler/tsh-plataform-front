export const getPathname = (type) => {
  switch (type) {
    case "seo-check":
      return "/seo-check";
    case "evaluation":
      return "/eeat-checker";
    case "llmstxt":
      return "/llms-txt-generator";
    case "content-planning":
      return "/content-planning";
    case "advanced-keyword-analysis":
      return "/advanced-keyword-analysis";
    case "search-intent":
      return "/search-intent";
    default:
      return "/seo-check";
  }
};
