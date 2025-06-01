// lib/schemas/homepage-schema.js
import { tools } from "@/lib/toolsMetaData";

export const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://theseohustler.com/#organization",
      "name": "The SEO Hustler",
      "url": "https://theseohustler.com",
      "logo": "https://theseohustler.com/the-seo-hustler-horizontal-full-black.png",
      "description":
        "The SEO Hustler provides free SEO advice, guides, actionable playbooks, and tools for SEOs and SMB owners to grow their organic visibility across traditional and AI-driven search.",
      "sameAs": [
        "https://www.linkedin.com/company/theseohustler/",
        "https://www.crunchbase.com/organization/the-seo-hustler"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Contact",
        "email": "hello@theseohustler.com"
      },
      "founder": {
        "@type": "Person",
        "name": "Zac Almeida",
        "url": "https://theseohustler.com/about",
        "sameAs": [
          "https://zacalmeida.com/",
          "https://www.linkedin.com/in/zacalmeida/"
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://theseohustler.com/#website",
      "url": "https://theseohustler.com",
      "name": "The SEO Hustler",
      "description":
        "SEO guides, actionable playbooks, and tools for SEOs and small businesses to boost organic visibility in traditional and AI search.",
      "publisher": { "@id": "https://theseohustler.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://theseohustler.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://theseohustler.com/#homepage",
      "url": "https://theseohustler.com",
      "name": "Home",
      "description":
        "Boost your organic search visibility with free SEO resources, actionable guides, and tools. The SEO Hustler empowers SEOs and SMB owners for success.",
      "isPartOf": { "@id": "https://theseohustler.com/#website" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://theseohustler.com/social-preview/index.png",
        "width": 1536,
        "height": 1024
      },
      "breadcrumb": { "@id": "https://theseohustler.com/#breadcrumb" },
      "publisher": { "@id": "https://theseohustler.com/#organization" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://theseohustler.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://theseohustler.com"
        }
      ]
    },
    {
      "@type": "ItemList",
      "name": "Featured Tools",
      "itemListElement": tools.map((tool, index) => {
        return {
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://theseohustler.com${tool.href}`,
          "name": tool.title,
          "description": tool.description
        }
      }),

    },
    {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".intro-paragraph"]
    }
  ]
};
