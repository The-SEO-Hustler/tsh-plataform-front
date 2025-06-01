export const blogSchema = (posts) => {

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://theseohustler.com/blog",
        "url": "https://theseohustler.com/blog",
        "name": "The SEO Hustler | Blog",
        "description": "Latest SEO tips, strategies, and insights to help improve your website's search engine rankings.",
        "isPartOf": {
          "@id": "https://theseohustler.com/#website"
        },
        "breadcrumb": {
          "@id": "https://theseohustler.com/blog#breadcrumb"
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
          "@id": "https://theseohustler.com/blog#itemlist"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://theseohustler.com/blog#breadcrumb",
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
              "@id": "https://theseohustler.com/blog",
              "name": "Blog"
            }
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://theseohustler.com/blog#itemlist",
        "name": "Blog Posts",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": posts.length,
        "itemListElement": [
          ...posts.map((post, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "CreativeWork",
              "@id": `https://theseohustler.com/blog/${post.slug}`,
              "name": post.title,
              "description": post.excerpt,
              "url": `https://theseohustler.com/blog/${post.slug}`,
              "author": {
                "@type": "Person",
                "name": "Zac Almeida",
                "url": "https://theseohustler.com/about",
                "sameAs": [
                  "https://www.linkedin.com/in/zacalmeida/",
                  "https://zacalmeida.com/",
                ]
              }
            }
          })),

        ]

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
