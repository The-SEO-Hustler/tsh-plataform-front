

export const resourcesSchema = (resources) => {
  let resorcesIndex = 1;
  const resourcesCount = resources.playbooks.length + resources.spreadsheets.length + resources.ebooks.length;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://theseohustler.com/resources",
        "url": "https://theseohustler.com/resources",
        "name": "Free SEO Resources & Templates",
        "description": "Download actionable resources, cheatsheets, playbooks, and templates to streamline your SEO workflow and get results faster.",
        "isPartOf": {
          "@id": "https://theseohustler.com/#website"
        },
        "breadcrumb": {
          "@id": "https://theseohustler.com/resources#breadcrumb"
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
          "@id": "https://theseohustler.com/resources#itemlist"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://theseohustler.com/resources#breadcrumb",
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
              "@id": "https://theseohustler.com/resources",
              "name": "Resources"
            }
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://theseohustler.com/resources#itemlist",
        "name": "SEO Playbooks",
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "numberOfItems": resourcesCount,
        "itemListElement": [
          ...resources.playbooks.map((playbook) => ({
            "@type": "ListItem",
            "position": resorcesIndex++,
            "item": {
              "@type": "CreativeWork",
              "@id": `https://theseohustler.com/playbooks/${playbook.slug}`,
              "name": playbook.title,
              "description": playbook.description,
              "url": `https://theseohustler.com/playbooks/${playbook.slug}`,
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
          ...resources.spreadsheets.map((spreadsheet) => ({
            "@type": "ListItem",
            "position": resorcesIndex++,
            "item": {
              "@type": "CreativeWork",
              "@id": `https://theseohustler.com/spreadsheets/${spreadsheet.slug}`,
              "name": spreadsheet.title,
              "description": spreadsheet.description,
              "url": `https://theseohustler.com/spreadsheets/${spreadsheet.slug}`,
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
          ...resources.ebooks.map((ebook) => ({
            "@type": "ListItem",
            "position": resorcesIndex++,
            "item": {
              "@type": "CreativeWork",
              "@id": `https://theseohustler.com/ebooks/${ebook.slug}`,
              "name": ebook.title,
              "description": ebook.description,
              "url": `https://theseohustler.com/ebooks/${ebook.slug}`,
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
          }))
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
