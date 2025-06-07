import { ScanSearch, ChartArea, NotebookPen, FileCode } from "lucide-react";

export const tools = [
  {
    title: "SEO Checker Tool",
    description:
      "Check your on-page SEO score and get real-time suggestions to improve your website.",
    Icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M35 17.5V12.25L26.25 3.5H10.5C9.57174 3.5 8.6815 3.86875 8.02513 4.52513C7.36875 5.1815 7 6.07174 7 7V35C7 35.9283 7.36875 36.8185 8.02513 37.4749C8.6815 38.1313 9.57174 38.5 10.5 38.5H17.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.5 3.5V10.5C24.5 11.4283 24.8687 12.3185 25.5251 12.9749C26.1815 13.6313 27.0717 14 28 14H35"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 29L28 31L32 27"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29 37C33.4183 37 37 33.4183 37 29C37 24.5817 33.4183 21 29 21C24.5817 21 21 24.5817 21 29C21 33.4183 24.5817 37 29 37Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39 39.0002L34.7 34.7002"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    href: "/seo-check",
    category: "On Page SEO Checker",
    featured: false,
    image: "/social-preview/tools/seo-checker.png",
    schemaPage: {
      name: "Free SEO Checker Tool That Actually Helps You Grow",
      description: "Analyze your website's SEO performance with our free tool. Get a comprehensive report covering meta tags, content quality, technical SEO, and more, along with actionable fixes.",
    }
  },
  {
    title: "E-E-A-T Checker",
    description:
      "Stop guessing your pages E-E-A-T and get a professional grade Needs Meet and Page Quality assessment for free.",
    Icon: (
      <ScanSearch
        width={56}
        height={56}
        strokeWidth={1.5}
        className=" rounded-md"
      />
    ),
    href: "/eeat-checker",
    category: "E-E-A-T",
    featured: true,
    image: "/social-preview/tools/eeat-checker.png",
    schemaPage: {
      name: "E-E-A-T Checker",
      description: "Stop guessing your pages E-E-A-T and get a professional grade Needs Meet and Page Quality assessment for free.",
    }
  },
  {
    title: "Advanced Keyword Analysis",
    description:
      "Get detailed insights and recommendations to optimize your keyword strategy.",
    Icon: (
      <ChartArea
        width={56}
        height={56}
        strokeWidth={1.5}
        className=" rounded-md"
      />
    ),
    href: "/advanced-keyword-analysis",
    category: "Advanced Keyword Analysis",
    featured: true,
    image: "/social-preview/tools/advanced-kw.png",
    schemaPage: {
      name: "Advanced Keyword Analysis",
      description: "Get detailed insights and recommendations to optimize your keyword strategy.",
    }
  },
  {
    title: "Content Planning Tool",
    description:
      "Plan your content strategy with detailed insights and recommendations.",
    Icon: (
      <NotebookPen
        width={56}
        height={56}
        strokeWidth={1.5}
        className=" rounded-md"
      />
    ),
    href: "/content-planning",
    category: "Content Planning Tool",
    featured: false,
    image: "/social-preview/tools/content-planning.png",
    schemaPage: {
      name: "Content Planning Tool",
      description: "Plan your content strategy with detailed insights and recommendations.",
    }
  },
  {
    title: "LLMs.txt Generator",
    description:
      "Create optimized LLMs.txt files in minutes, not hours. Control how AI sees and represents your business.",
    Icon: (
      <FileCode
        width={56}
        height={56}
        strokeWidth={1.5}
        className=" rounded-md"
      />
    ),
    href: "/llms-txt-generator",
    category: "LLMs.txt Generator",
    featured: true,
    image: "/social-preview/tools/llm.png",
    schemaPage: {
      name: "LLMs.txt Generator",
      description: "Create optimized LLMs.txt files in minutes, not hours. Control how AI sees and represents your business.",
    }
  },
];