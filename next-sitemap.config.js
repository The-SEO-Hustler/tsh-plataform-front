module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONT_URL,
  generateRobotsTxt: true,
  exclude: ['/content-planning/result', '/advanced-keyword-analysis/result', '/seo-check/result', '/blog/*', '/guides/*', '/spreadsheets/*', '/ebooks/*', '/llmstxt/result'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/content-planning/result', '/advanced-keyword-analysis/result', '/seo-check/result', '/llmstxt/result'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_FRONT_URL}/blog-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_FRONT_URL}/resources-sitemap.xml`,
    ],
  },
};


