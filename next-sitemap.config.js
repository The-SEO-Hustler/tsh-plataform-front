module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONT_URL,
  generateRobotsTxt: true,
  exclude: ['/content-planning/result', '/advanced-keyword-analysis/result', '/seo-check/result', '/blog/*', '/guides/*', '/spreadsheets/*', '/ebooks/*', '/llms-txt-generator/result'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/content-planning/result', '/advanced-keyword-analysis/result', '/seo-check/result', '/llms-txt-generator/result'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_FRONT_URL}/blog-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_FRONT_URL}/resources-sitemap.xml`,
    ],
  },
};


