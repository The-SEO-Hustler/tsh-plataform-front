export const toolSchema = (tool) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://theseohustler.com${tool.href}`,
        "url": `https://theseohustler.com${tool.href}`,
        "name": tool.schemaPage.name,
        "description": tool.schemaPage.description,
        "isPartOf": {
          "@id": "https://theseohustler.com/#website"
        },
        "breadcrumb": {
          "@id": `https://theseohustler.com${tool.href}#breadcrumb`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://theseohustler.com/social-preview/index.png",
          "width": 1536,
          "height": 1024
        },
        "publisher": {
          "@id": "https://theseohustler.com/#organization"
        },
        "mainEntity": {
          "@id": `https://theseohustler.com${tool.href}#softwareapplication`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://theseohustler.com${tool.href}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@id": "https://theseohustler.com",
              "name": "Home"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@id": "https://theseohustler.com/free-tools",
              "name": "Free Tools"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@id": `https://theseohustler.com${tool.href}`,
              "name": tool.title
            }
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": `https://theseohustler.com${tool.href}#softwareapplication`,
        "name": tool.title,
        "description": tool.schemaPage.description,
        "applicationCategory": "SEO Tool",
        "operatingSystem": "All",
        "url": `https://theseohustler.com${tool.href}`,
        "image": `https://theseohustler.com${tool.image}`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@id": "https://theseohustler.com/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://theseohustler.com/#organization",
        "name": "The SEO Hustler",
        "url": "https://theseohustler.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://theseohustler.com/the-seo-hustler-horizontal-full-black.png",
          "width": 1117,
          "height": 256
        },
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
            "https://www.linkedin.com/in/zacalmeida/",
            "https://zacalmeida.com/"
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://theseohustler.com/#website",
        "url": "https://theseohustler.com",
        "name": "The SEO Hustler",
        "description": "SEO guides, actionable playbooks, and tools for SEOs and small businesses to boost organic visibility in traditional and AI search.",
        "publisher": {
          "@id": "https://theseohustler.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://theseohustler.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }
}