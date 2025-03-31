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
import SeoUrlCard from "@/components/Cards/SeoUrlCard";
import ImageResponsivenessCard from "@/components/Cards/ImageResponsivenessCard";
import AnalyticsGtmCard from "@/components/Cards/AnalyticsGtmCard";
import FaviconCheckCard from "@/components/Cards/FaviconCheckCard";
import JsErrorsCheckCard from "@/components/Cards/JsErrorsCheckCard";
import HtmlSizeCheckCard from "@/components/Cards/HtmlSizeCheckCard";
import DeprecatedHtmlCard from "@/components/Cards/DeprecatedHtmlCard";
import ConsoleErrorsCheckCard from "@/components/Cards/ConsoleErrorsCheckCard";
import CharsetCheckCard from "@/components/Cards/CharsetCheckCard";
import DomSizeCheckCard from "@/components/Cards/DomSizeCheckCard";
import HtmlCompressionCard from "@/components/Cards/HtmlCompressionCard";
import RequestCountCheckCard from "@/components/Cards/RequestCountCheckCard";
import {
  FileText,
  Globe,
  Image,
  BarChart,
  AlertTriangle,
  Network,
  Compass,
  Terminal,
  CheckCircle,
  XCircle,
  Tag,
  Link,
  Search,
  Heading1,
  FileCode,
  Heading2,
  Share2,
  Code,
  Lock,
} from "lucide-react";

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
  "seo-url": SeoUrlCard,
  "image-responsiveness": ImageResponsivenessCard,
  analyticsGtmCheck: AnalyticsGtmCard,
  htmlSizeCheck: HtmlSizeCheckCard,
  jsErrorsCheck: JsErrorsCheckCard,
  faviconCheck: FaviconCheckCard,
  deprecatedHtml: DeprecatedHtmlCard,
  consoleErrorsCheck: ConsoleErrorsCheckCard,
  charsetCheck: CharsetCheckCard,
  domSizeCheck: DomSizeCheckCard,
  htmlCompression: HtmlCompressionCard,
  requestCountCheck: RequestCountCheckCard,
};

// Centralized icon mapping
export const iconMapping = {
  title: FileText,
  "meta-description": FileText,
  h1: Heading1,
  socialTags: Share2,
  headings: Code,
  h2Tags: Heading2,
  robotsTxt: Lock,
  sitemapCheck: FileCode,
  brokenLinksCheck: Link,
  keywordAnalysis: Search,
  "image-alt": Image,
  "seo-url": Globe,
  "image-responsiveness": Image,
  analyticsGtmCheck: BarChart,
  faviconCheck: Image,
  jsErrorsCheck: Terminal,
  consoleErrorsCheck: Terminal,
  charsetCheck: FileText,
  htmlSizeCheck: FileText,
  domSizeCheck: Network,
  htmlCompression: Compass,
  requestCountCheck: Network,
  cacheCheck: CheckCircle,
  flashCheck: XCircle,
  cdnCheck: Network,
  modernMedia: Image,
};

// Helper function to get icon component
export const getIconComponent = (type) => {
  const Icon = iconMapping[type];
  return Icon ? <Icon className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
};

export const mockData = [
  {
    type: "title",
    data: {
      value:
        "Zac Almeida SEO Consultant | AI Architect, RAG and LLM Optimization",
      length: 67,
    },
    analysis: "Title might be too long.",
  },
  {
    type: "meta-description",
    status: "warning",
    data: {
      isPresent: true,
      value:
        "Trustable SEO advice from Zac Almeida on organic growth through SEO, leveraing AI and LLMs to boost your business bottom line, and preparing for the next generation of engines.",
      length: 176,
    },
    analysis: "Meta description is too long.",
  },
  {
    type: "h1",
    status: "normal",
    data: {
      value: ["Disrupting Search. Delivering Growth."],
      length: 1,
    },
    analysis: "Exactly one H1 found.",
  },
  {
    type: "socialTags",
    status: "warning",
    data: {
      openGraph: {
        present: {
          "og:title": {
            content:
              "Zac Almeida SEO Consultant | AI Architect, RAG and LLM Optimization",
            description: "Title for social media previews",
          },
          "og:description": {
            content:
              "Trustable SEO advice from Zac Almeida on organic growth through SEO, leveraing AI and LLMs to boost your business bottom line, and preparing for the next generation of engines.",
            description: "Short description for social sharing",
          },
          "og:url": {
            content: "https://zacalmeida.com",
            description: "Canonical URL of the page",
          },
          "og:type": {
            content: "website",
            description: "Type of content (e.g., website, article)",
          },
        },
        missing: {
          "og:image": "Image URL for social preview",
        },
      },
      twitterCard: {
        present: {
          "twitter:card": {
            content: "summary_large_image",
            description:
              "Type of Twitter card (e.g., summary, summary_large_image)",
          },
          "twitter:title": {
            content:
              "Zac Almeida SEO Consultant | AI Architect, RAG and LLM Optimization",
            description: "Title for Twitter preview",
          },
          "twitter:description": {
            content:
              "Trustable SEO advice from Zac Almeida on organic growth through SEO, leveraing AI and LLMs to boost your business bottom line, and preparing for the next generation of engines.",
            description: "Short description for Twitter",
          },
        },
        missing: {
          "twitter:image": "Image URL for Twitter preview",
        },
      },
    },
    analysis: {
      openGraph: "Some Open Graph tags are missing.",
      twitterCard: "Some Twitter Card tags are missing.",
    },
  },
  {
    type: "h2Tags",
    status: "normal",
    data: {
      hasH2: true,
      count: 8,
      headers: [
        {
          text: "Turning Complex SEO and AI Challenges Into Growth Opportunities",
          length: 63,
        },
        {
          text: "",
          length: 0,
        },
        {
          text: "Full-Stack Organic Strategy",
          length: 27,
        },
        {
          text: "Harnessing AI and Algorithm Breakthroughs for Growth",
          length: 52,
        },
        {
          text: "15 years of enterprise",
          length: 22,
        },
        {
          text: "Recent Success Stories",
          length: 22,
        },
        {
          text: "Connect, Collaborate, and Create Impact",
          length: 39,
        },
        {
          text: "Get In Touch",
          length: 12,
        },
      ],
    },
    analysis: "This page has 8 H2 tags.",
  },
  {
    type: "headings",
    status: "warning",
    data: {
      h3: {
        count: 30,
        headers: [
          {
            text: "SEO Groundwork",
            length: 14,
          },
          {
            text: "Technical SEO",
            length: 13,
          },
          {
            text: "Content Strategy",
            length: 16,
          },
          {
            text: "E-E-A-T Development and Optimization",
            length: 36,
          },
          {
            text: "ePR (Link Building)",
            length: 19,
          },
          {
            text: "Local SEO",
            length: 9,
          },
          {
            text: "Main Content (MC) Optimization",
            length: 30,
          },
          {
            text: "Supplementary Content (SC) Optimization",
            length: 39,
          },
          {
            text: "Page Quality (PQ) Assessment and Improvement",
            length: 44,
          },
          {
            text: "User Needs and Needs Met Assessment and Development",
            length: 51,
          },
          {
            text: "E-E-A-T For Health and Wellness Brands",
            length: 38,
          },
          {
            text: "Your Money or Your Life (YMYL) Topics",
            length: 37,
          },
          {
            text: "Retrieval-Augmented Generation (RAG) Search Optimization",
            length: 56,
          },
          {
            text: "Generative AI Search Optimization (GAIO)",
            length: 40,
          },
          {
            text: "Advanced Prompt Chaining for Automation",
            length: 39,
          },
          {
            text: "Development of AI SEO Agents",
            length: 28,
          },
          {
            text: "AI Agent: On-Page Experimenting",
            length: 31,
          },
          {
            text: "AI Agent: Content Operations and Scale",
            length: 38,
          },
          {
            text: "Machine Learning for SEO",
            length: 24,
          },
          {
            text: "Prompt Grading",
            length: 14,
          },
          {
            text: "Programmatic Content",
            length: 20,
          },
          {
            text: "6 Months Journey to $10K Monthly Sales",
            length: 38,
          },
          {
            text: "SME's Journey from Invisible to Organic Leader in 10 Months",
            length: 59,
          },
          {
            text: "Perfect Keto's Rise Against the Tide",
            length: 36,
          },
          {
            text: "Strategic Consultation",
            length: 22,
          },
          {
            text: "Conference Speaking",
            length: 19,
          },
          {
            text: "Research Collaboration",
            length: 22,
          },
          {
            text: "Team Training",
            length: 13,
          },
          {
            text: "CONTENT",
            length: 7,
          },
          {
            text: "OTHER",
            length: 5,
          },
        ],
      },
      h4: {
        count: 0,
      },
      h5: {
        count: 0,
      },
      h6: {
        count: 0,
      },
    },
    analysis: {
      h3: "This page has 30 H3 tags.",
      h4: "No H4 tags found.",
      h5: "No H5 tags found.",
      h6: "No H6 tags found.",
    },
  },
  {
    type: "robotsTxt",
    status: "normal",
    data: {
      exists: true,
      content: "User-Agent: *\ndisallow:",
      disallowedPaths: [],
    },
    analysis: "Robots.txt found and analyzed.",
  },
  {
    type: "sitemapCheck",
    status: "error",
    data: {
      foundInRobots: false,
      sitemaps: [],
      totalUrls: 0,
    },
    analysis: "No valid sitemap found.",
  },
  {
    type: "brokenLinksCheck",
    status: "warning",
    data: {
      totalLinks: 17,
      internalLinks: 11,
      externalLinks: 4,
      specialLinks: [
        {
          anchor: "[No Text]",
          href: "mailto:me@zacalmeida.com",
        },
        {
          anchor: "[No Text]",
          href: "mailto:me@zacalmeida.com",
        },
      ],
      brokenLinks: [
        {
          anchor: "[No Text]",
          url: "https://www.linkedin.com/in/zacalmeida/",
          status: 999,
        },
      ],
      non200Links: [
        {
          anchor: "Home",
          url: "https://zacalmeida.com/",
          status: 304,
        },
        {
          anchor: "Get In Touch",
          url: "https://zacalmeida.com/#contact",
          status: 304,
        },
        {
          anchor: "[No Text]",
          url: "https://www.linkedin.com/in/zacalmeida/",
          status: 999,
        },
        {
          anchor: "Blog",
          url: "https://zacalmeida.com/blog",
          status: 304,
        },
        {
          anchor: "Case Studies",
          url: "https://zacalmeida.com/case-studies",
          status: 304,
        },
        {
          anchor: "Get In Touch",
          url: "https://zacalmeida.com/#contact",
          status: 304,
        },
        {
          anchor: "Zac Almeida",
          url: "https://zacalmeida.com/",
          status: 304,
        },
      ],
    },
    analysis: "Found 1 broken links out of 15 HTTP/HTTPS links checked.",
  },
  {
    type: "keywordAnalysis",
    status: "normal",
    data: {
      value: {
        totalWords: 771,
        uniqueWords: 376,
      },
      topKeywords: [
        {
          word: "ai",
          count: 28,
        },
        {
          word: "search",
          count: 18,
        },
        {
          word: "case",
          count: 17,
        },
        {
          word: "seo",
          count: 17,
        },
        {
          word: "organic",
          count: 15,
        },
        {
          word: "content",
          count: 13,
        },
        {
          word: "study",
          count: 13,
        },
        {
          word: "growth",
          count: 12,
        },
        {
          word: "experience",
          count: 12,
        },
        {
          word: "generative",
          count: 8,
        },
        {
          word: "digital",
          count: 7,
        },
        {
          word: "algorithm",
          count: 7,
        },
        {
          word: "technical",
          count: 7,
        },
        {
          word: "journey",
          count: 7,
        },
        {
          word: "rag",
          count: 6,
        },
        {
          word: "user",
          count: 6,
        },
        {
          word: "strategy",
          count: 6,
        },
        {
          word: "development",
          count: 6,
        },
        {
          word: "optimization",
          count: 6,
        },
        {
          word: "months",
          count: 6,
        },
      ],
      keywordUsage: [
        {
          word: "ai",
          count: 28,
          percentage: "3.63",
        },
        {
          word: "search",
          count: 18,
          percentage: "2.33",
        },
        {
          word: "case",
          count: 17,
          percentage: "2.20",
        },
        {
          word: "seo",
          count: 17,
          percentage: "2.20",
        },
        {
          word: "organic",
          count: 15,
          percentage: "1.95",
        },
        {
          word: "content",
          count: 13,
          percentage: "1.69",
        },
        {
          word: "study",
          count: 13,
          percentage: "1.69",
        },
        {
          word: "growth",
          count: 12,
          percentage: "1.56",
        },
        {
          word: "experience",
          count: 12,
          percentage: "1.56",
        },
        {
          word: "generative",
          count: 8,
          percentage: "1.04",
        },
        {
          word: "digital",
          count: 7,
          percentage: "0.91",
        },
        {
          word: "algorithm",
          count: 7,
          percentage: "0.91",
        },
        {
          word: "technical",
          count: 7,
          percentage: "0.91",
        },
        {
          word: "journey",
          count: 7,
          percentage: "0.91",
        },
        {
          word: "rag",
          count: 6,
          percentage: "0.78",
        },
        {
          word: "user",
          count: 6,
          percentage: "0.78",
        },
        {
          word: "strategy",
          count: 6,
          percentage: "0.78",
        },
        {
          word: "development",
          count: 6,
          percentage: "0.78",
        },
        {
          word: "optimization",
          count: 6,
          percentage: "0.78",
        },
        {
          word: "months",
          count: 6,
          percentage: "0.78",
        },
      ],
    },
    keywordCloud: [
      {
        text: "ai",
        value: 28,
        size: 10,
      },
      {
        text: "search",
        value: 18,
        size: 6,
      },
      {
        text: "case",
        value: 17,
        size: 6,
      },
      {
        text: "seo",
        value: 17,
        size: 6,
      },
      {
        text: "organic",
        value: 15,
        size: 5,
      },
      {
        text: "content",
        value: 13,
        size: 5,
      },
      {
        text: "study",
        value: 13,
        size: 5,
      },
      {
        text: "growth",
        value: 12,
        size: 4,
      },
      {
        text: "experience",
        value: 12,
        size: 4,
      },
      {
        text: "generative",
        value: 8,
        size: 3,
      },
      {
        text: "digital",
        value: 7,
        size: 3,
      },
      {
        text: "algorithm",
        value: 7,
        size: 3,
      },
      {
        text: "technical",
        value: 7,
        size: 3,
      },
      {
        text: "journey",
        value: 7,
        size: 3,
      },
      {
        text: "rag",
        value: 6,
        size: 2,
      },
      {
        text: "user",
        value: 6,
        size: 2,
      },
      {
        text: "strategy",
        value: 6,
        size: 2,
      },
      {
        text: "development",
        value: 6,
        size: 2,
      },
      {
        text: "optimization",
        value: 6,
        size: 2,
      },
      {
        text: "months",
        value: 6,
        size: 2,
      },
    ],
  },
  {
    type: "image-alt",
    status: "error",
    data: {
      totalImages: 5,
      imagesWithAlt: 0,
      imagesWithoutAlt: [
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fzac-almeida-seo.webp&w=3840&q=75",
          alt: "missing",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2F15-years-seo-experience.webp&w=3840&q=75",
          alt: "missing",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2FCognitive-Distortions.webp&w=3840&q=75",
          alt: "missing",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fseo-case-study.webp&w=3840&q=75",
          alt: "missing",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fseo-case-study-perfect-keto.webp&w=3840&q=75",
          alt: "missing",
        },
      ],
    },
    analysis: "5 images are missing alt tags.",
    passed: false,
  },
  {
    type: "seo-url",
    status: "normal",
    data: {
      url: "https://zacalmeida.com/",
      checks: {
        noSpecialChars: true,
        isLowercase: true,
        noExtraSlashes: true,
        noConsecutiveDashes: true,
        isMeaningful: true,
      },
      isSeoFriendly: true,
    },
    analysis: "URL is SEO friendly.",
  },
  {
    type: "image-responsiveness",
    status: "error",
    data: {
      totalImages: 5,
      score: 2,
      details: [
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fzac-almeida-seo.webp&w=3840&q=75",
          ratio: "2.00",
          score: 10,
          message:
            "Image https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fzac-almeida-seo.webp&w=3840&q=75 is being displayed at one-third of its natural size. This is inefficient for performance.",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2F15-years-seo-experience.webp&w=3840&q=75",
          ratio: "0.00",
          score: 0,
          message:
            "Image https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2F15-years-seo-experience.webp&w=3840&q=75 is being displayed larger than its natural size. Consider using a larger image to maintain crisp visualization.",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2FCognitive-Distortions.webp&w=3840&q=75",
          ratio: "0.00",
          score: 0,
          message:
            "Image https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2FCognitive-Distortions.webp&w=3840&q=75 is being displayed larger than its natural size. Consider using a larger image to maintain crisp visualization.",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fseo-case-study.webp&w=3840&q=75",
          ratio: "0.00",
          score: 0,
          message:
            "Image https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fseo-case-study.webp&w=3840&q=75 is being displayed larger than its natural size. Consider using a larger image to maintain crisp visualization.",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fseo-case-study-perfect-keto.webp&w=3840&q=75",
          ratio: "0.00",
          score: 0,
          message:
            "Image https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fseo-case-study-perfect-keto.webp&w=3840&q=75 is being displayed larger than its natural size. Consider using a larger image to maintain crisp visualization.",
        },
      ],
    },
    analysis:
      "Several images are not optimally sized for their display dimensions.",
    passed: false,
  },
  {},
  {},
  {},
  {},
  {
    type: "jsErrorsCheck",
    status: "normal",
    data: {
      jsErrors: [
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to fetch RSC payload for https://zacalmeida.com/#contact. Falling back to browser navigation. JSHandle@error",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to fetch RSC payload for https://zacalmeida.com/blog. Falling back to browser navigation. JSHandle@error",
        "Failed to fetch RSC payload for https://zacalmeida.com/#contact. Falling back to browser navigation. JSHandle@error",
        "Failed to fetch RSC payload for https://zacalmeida.com/case-studies. Falling back to browser navigation. JSHandle@error",
      ],
    },
    analysis: "No JavaScript errors were detected on the page.",
  },
  {
    type: "consoleErrorsCheck",
    status: "normal",
    data: {
      consoleErrors: [
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to fetch RSC payload for https://zacalmeida.com/#contact. Falling back to browser navigation. JSHandle@error",
        "Failed to load resource: the server responded with a status of 404 ()",
        "Failed to fetch RSC payload for https://zacalmeida.com/blog. Falling back to browser navigation. JSHandle@error",
        "Failed to fetch RSC payload for https://zacalmeida.com/#contact. Falling back to browser navigation. JSHandle@error",
        "Failed to fetch RSC payload for https://zacalmeida.com/case-studies. Falling back to browser navigation. JSHandle@error",
      ],
    },
    analysis: "No console errors were detected on the page.",
  },
  {
    type: "charsetCheck",
    status: "normal",
    data: {
      charsetDeclared: true,
    },
    analysis: "Charset declaration found on the page.",
  },
  {
    type: "htmlSizeCheck",
    status: "normal",
    data: {
      sizeInBytes: 273945,
      sizeInKB: "267.52",
    },
    analysis: "The HTML page size is 273945 bytes (267.52 KB).",
  },
  {
    type: "domSizeCheck",
    status: "normal",
    data: {
      totalNodes: 949,
      maxDepth: 24,
    },
    analysis: "The DOM contains 949 nodes with a maximum depth of 24.",
  },
  {
    type: "htmlCompression",
    status: "error",
    data: {
      compressed: false,
      encoding: null,
    },
    analysis: "The page does not seem to use HTML compression.",
  },
  {
    type: "requestCountCheck",
    status: "normal",
    data: {
      count: 33,
      resources: [
        "https://zacalmeida.com/_next/static/media/4473ecc91f70f139-s.p.woff",
        "https://zacalmeida.com/_next/static/media/463dafcda517f24f-s.p.woff",
        "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fzac-almeida-seo.webp&w=828&q=75",
        "https://zacalmeida.com/_next/static/css/e0a316f82d50ca12.css",
        "https://zacalmeida.com/_next/static/css/fa3632996c08bcfa.css",
        "https://zacalmeida.com/_next/static/css/c1b06ecbb9127114.css",
        "https://zacalmeida.com/_next/static/css/ef99394ca71d135e.css",
        "https://zacalmeida.com/_next/static/css/f3af53a2c5364053.css",
        "https://zacalmeida.com/_next/static/css/4d3d9169b46fed63.css",
        "https://zacalmeida.com/_next/static/css/08d14c2f213a09b5.css",
        "https://zacalmeida.com/_next/static/css/5994c4ce7c0648e0.css",
        "https://zacalmeida.com/_next/static/css/76ddee4b4ad6f7f0.css",
        "https://zacalmeida.com/_next/static/chunks/webpack-852e5d7ba1330f47.js",
        "https://zacalmeida.com/_next/static/chunks/fd9d1056-29402e598f4ff9a5.js",
        "https://zacalmeida.com/_next/static/chunks/117-7a1270f098a8c932.js",
        "https://zacalmeida.com/_next/static/chunks/main-app-2dcde4753ea0d175.js",
        "https://zacalmeida.com/_next/static/chunks/app/layout-a3ed882090f15d98.js",
        "https://zacalmeida.com/_next/static/chunks/972-845546eec5794bc8.js",
        "https://zacalmeida.com/_next/static/chunks/0e5ce63c-080560c3d24aed72.js",
        "https://zacalmeida.com/_next/static/chunks/dc112a36-8f8e8df18f2f5a7c.js",
        "https://zacalmeida.com/_next/static/chunks/878-f1f0f5bf5c798b4b.js",
        "https://zacalmeida.com/_next/static/chunks/844-94164051885c8169.js",
        "https://zacalmeida.com/_next/static/chunks/app/page-6876d7d624b0dc41.js",
        "https://zacalmeida.com/favicon/favicon.png",
        "https://zacalmeida.com/animation-click.json",
        "https://zacalmeida.com/animation-click.json",
        "https://zacalmeida.com/animation-click.json",
        "https://zacalmeida.com/animation-click.json",
        "https://zacalmeida.com/favicon.ico",
        "https://zacalmeida.com/case-studies?_rsc=1wtp7",
        "https://zacalmeida.com/blog?_rsc=1wtp7",
        "https://zacalmeida.com/_next/static/chunks/app/case-studies/page-7d91b9fb7b8b64d7.js",
        "https://zacalmeida.com/_next/static/chunks/app/blog/layout-a81a2ff28cf6c4bf.js",
      ],
    },
    analysis: "The page made 33 HTTP requests during load.",
  },
  {
    type: "cacheCheck",
    status: "normal",
    data: {
      caching: true,
      headers: {
        "cache-control": "public, max-age=0, must-revalidate",
        expires: null,
        etag: '"h5dpb0e4ie5p1s"',
        "last-modified": null,
        age: "14",
      },
    },
    analysis: "The server is using caching headers.",
  },
  {
    type: "flashCheck",
    status: "normal",
    data: {
      usesFlash: false,
      flashCount: 0,
    },
    analysis: "No Flash elements detected on the page.",
  },
  {
    type: "cdnCheck",
    status: "normal",
    data: {
      usesCDN: false,
      cdnCount: 0,
      resources: [],
    },
    analysis: "No CDN-related resource requests were detected on the page.",
  },
  {
    type: "modernMedia",
    status: "warning",
    data: {
      totalImages: 5,
      modernImages: 0,
      images: [
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fzac-almeida-seo.webp&w=3840&q=75",
          extension: "",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2F15-years-seo-experience.webp&w=3840&q=75",
          extension: "",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2FCognitive-Distortions.webp&w=3840&q=75",
          extension: "",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2025%2F03%2Fseo-case-study.webp&w=3840&q=75",
          extension: "",
        },
        {
          src: "https://zacalmeida.com/_next/image?url=https%3A%2F%2Fwordpress-429601-5087620.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fseo-case-study-perfect-keto.webp&w=3840&q=75",
          extension: "",
        },
      ],
    },
    analysis:
      "This page contains 5 images, out of which 0 use modern formats (webp, avif).",
  },
];
