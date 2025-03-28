import HeadingsCard from "@/components/Cards/HeadingsCard";
import LinksCard from "@/components/Cards/LinksCard";
import MetaCard from "@/components/Cards/MetaCard";
import KeywordsCard from "@/components/Cards/KeywordsCard";
import MetaRobotsCard from "@/components/Cards/MetaRobotsCard";
import SitemapCard from "@/components/Cards/SitemapCard";
import TitleCard from "@/components/Cards/TitleCard";
import MetaDescriptionCard from "@/components/Cards/MetaDescriptionCard";
import H1Card from "@/components/Cards/H1Card";
import SocialTagsCard from "@/components/Cards/SocialTagsCard";
import H2TagsCard from "@/components/Cards/H2TagsCard";
import RobotsTxtCard from "@/components/Cards/RobotsTxtCard";
import SitemapCheckCard from "@/components/Cards/SitemapCheckCard";
import BrokenLinksCheckCard from "@/components/Cards/BrokenLinksCheckCard";
import KeywordAnalysisCard from "@/components/Cards/KeywordAnalysisCard";
import ImageAltCard from "@/components/Cards/ImageAltCard";

export const cardComponents = {
  headings: HeadingsCard,
  links: LinksCard,
  meta: MetaCard,
  keywords: KeywordsCard,
  metaRobots: MetaRobotsCard,
  sitemap: SitemapCard,
  title: TitleCard,
  "meta-description": MetaDescriptionCard,
  h1: H1Card,
  socialTags: SocialTagsCard,
  h2Tags: H2TagsCard,
  robotsTxt: RobotsTxtCard,
  sitemapCheck: SitemapCheckCard,
  brokenLinksCheck: BrokenLinksCheckCard,
  keywordAnalysis: KeywordAnalysisCard,
  "image-alt": ImageAltCard,
};

export const mockData = [
  {
    type: "headings",
    data: [
      { name: "H1", count: 1 },
      { name: "H2", count: 5 },
      { name: "H3", count: 8 },
      { name: "H4", count: 3 },
    ],
    status: "normal",
    description: "Heading structure looks good with proper hierarchy.",
  },
  {
    type: "links",
    data: [
      { name: "Internal", value: 24 },
      { name: "External", value: 42 },
    ],
    status: "warning",
    description:
      "Warning: High number of external links (42). This might dilute your page's authority.",
  },
  {
    type: "meta",
    data: {
      ogDescription: null,
    },
    status: "error",
    description:
      "Error: Missing Open Graph description. This affects social media sharing appearance.",
  },
  {
    type: "keywords",
    data: [
      { keyword: "seo", count: 15 },
      { keyword: "analysis", count: 12 },
      { keyword: "marketing", count: 8 },
      { keyword: "traffic", count: 6 },
    ],
    status: "normal",
    description: "Top keywords are well-distributed throughout the content.",
  },
  {
    type: "metaRobots",
    data: {
      index: "index",
      follow: "follow",
    },
    status: "normal",
    description:
      "Robots directives are properly set for search engine crawling.",
  },
  {
    type: "sitemap",
    data: true,
    status: "normal",
    description: "Sitemap is present and properly configured.",
  },
  {
    type: "title",
    status: "warning",
    description: "Title might be too long.",
    data: {
      value:
        "globo.com - Absolutamente tudo sobre notícias, esportes e entretenimento",
      length: 72,
    },
  },
  {
    type: "meta-description",
    status: "normal",
    description: "Meta description looks good.",
    data: {
      isPresent: true,
      value:
        "Últimas notícias do jornalismo, esporte, entretenimento e mais! Na globo.com você acompanha tudo que está acontecendo hoje no Brasil e no mundo.",
      length: 144,
    },
  },
  {
    type: "h1",
    status: "warning",
    description: "Multiple H1 tags found.",
    data: {
      values: [
        "",
        "12x R$ 39,90",
        "12x R$ 50,80",
        "12x R$ 29,90",
        "12x R$ 4,99",
      ],
      length: 5,
    },
  },
  {
    type: "socialTags",
    status: "normal",
    description: "All essential Open Graph and Twitter Card tags are present.",
    data: {
      openGraph: {
        present: {
          "og:title":
            "globo.com - Absolutamente tudo sobre notícias, esportes e entretenimento",
          "og:description":
            "Últimas notícias do jornalismo, esporte, entretenimento e mais! Na globo.com você acompanha tudo que está acontecendo hoje no Brasil e no mundo.",
          "og:image":
            "https://s3.glbimg.com/v1/AUTH_fd78dc4be9404a2e92b908ade306e9e6/prod/globocom_opengraph.png",
          "og:url": "https://www.globo.com/",
          "og:type": "website",
        },
      },
      twitterCard: {
        present: {
          "twitter:card": "summary",
          "twitter:title":
            "globo.com - Absolutamente tudo sobre notícias, esportes e entretenimento",
          "twitter:description":
            "Últimas notícias do jornalismo, esporte, entretenimento e mais! Na globo.com você acompanha tudo que está acontecendo hoje no Brasil e no mundo.",
          "twitter:image":
            "https://s3.glbimg.com/v1/AUTH_fd78dc4be9404a2e92b908ade306e9e6/prod/globocom_opengraph.png",
        },
      },
    },
  },
  {
    type: "h2Tags",
    status: "warning",
    description: "This page has a high number of H2 tags (112).",
    data: {
      hasH2: true,
      count: 112,
      headers: [],
    },
  },
  {
    type: "robotsTxt",
    status: "normal",
    description: "Disallow rules detected in robots.txt.",
    data: {
      exists: true,
      content:
        "# robots.txt\nUser-Agent: *\nDisallow: /busca/\nDisallow: /beta/\nDisallow: /historico-home/\n...",
      disallowedPaths: [
        "/busca/",
        "/beta/",
        "/historico-home/",
        "*globo-cdn-src/*",
        "/alt-a/",
        "/alt-b/",
        "/alt-c/",
        "/alt-d/",
        "/recomendado/",
        "/explore/",
      ],
    },
  },
  {
    type: "sitemapCheck",
    status: "normal",
    description: "Sitemap(s) found. Total 1 URLs present.",
    data: {
      foundInRobots: true,
      sitemaps: [
        {
          url: "http://www.globo.com/sitemap-image.xml",
          urlCount: 1,
          level: 1,
        },
      ],
      totalUrls: 1,
    },
  },
  {
    type: "brokenLinksCheck",
    status: "normal",
    description: "No broken links found.",
    data: {
      totalLinks: 0,
      internalLinks: 0,
      externalLinks: 0,
      brokenLinks: [],
      non200Links: [],
    },
  },
  {
    type: "keywordAnalysis",
    status: "normal",
    description: "Keyword analysis completed.",
    data: {
      totalWords: 3462,
      uniqueWords: 479,
      topKeywords: [
        { word: "image", count: 394 },
        { word: "com", count: 261 },
        { word: "glbimg", count: 256 },
      ],
      keywordUsage: [
        { word: "image", count: 394, percentage: "11.38%" },
        { word: "v1", count: 70, percentage: "2.02%" },
        { word: "auth", count: 70, percentage: "2.02%" },
      ],
      keywordCloud: [
        { text: "image", value: 394, size: 10 },
        { text: "com", value: 261, size: 7 },
        { text: "glbimg", value: 256, size: 6 },
      ],
    },
  },
  {
    type: "image-alt",
    status: "normal",
    description: "No images found on the page.",
    data: {
      totalImages: 0,
      imagesWithAlt: 0,
      imagesWithoutAlt: [],
    },
  },
];
