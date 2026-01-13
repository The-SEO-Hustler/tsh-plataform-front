// lib/schemas/resource-post-schema.js

export const resourcePostSchema = (resource, path, type) => {
  // Build base URLs
  const BASE = process.env.NEXT_PUBLIC_FRONT_URL || 'https://theseohustler.com';
  const pageUrl = `${BASE}/${path}/${resource.slug}`;

  // Construct the “primaryImageOfPage” URL using Next.js Image optimization endpoint
  const imageObj = {
    "@type": "ImageObject",
    "url":
      `${BASE}/_next/image` +
      `?url=${encodeURIComponent(resource?.featuredImage)}` +
      `&w=1200&q=85`,
    "width": 1200,
    "height": 800,
  };

  // Start building the graph
  const graph = [];

  // 1) WebPage object
  graph.push({
    "@type": "WebPage",
    "@id": pageUrl,
    "url": pageUrl,
    "name": resource.title,
    "description": resource.description,
    "isPartOf": { "@id": `${BASE}/#website` },
    "breadcrumb": { "@id": `${pageUrl}#breadcrumb` },
    "primaryImageOfPage": imageObj,
    "publisher": { "@id": `${BASE}/#organization` },
    "mainEntity": { "@id": `${pageUrl}#${type.toLowerCase()}` },
  });

  // 2) BreadcrumbList
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": { "@id": BASE, "name": "Home" },
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": { "@id": `${BASE}/resources`, "name": "Resources" },
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": { "@id": pageUrl, "name": resource.title },
      },
    ],
  });

  // 3) LearningResource object
  const learningResource = {
    "@type": "LearningResource",
    "@id": `${pageUrl}#${type.toLowerCase()}`,
    "headline": resource.title,
    "alternativeHeadline": resource.title,
    "description": resource.description,
    "image": imageObj,
    "author": {
      "@type": "Person",
      "name": "Zac Almeida",
      "url": `${BASE}/about`,
      "sameAs": [
        "https://www.linkedin.com/in/zacalmeida/",
        "https://zacalmeida.com/",
      ],
    },
    "publisher": { "@id": `${BASE}/#organization` },
    "datePublished": resource.rawDate,
    "dateModified": resource.modified,
    "learningResourceType": type,
    "educationalLevel": "Intermediate",
    "audience": {
      "@type": "Audience",
      "audienceType": "SEO professionals, Business Owners",
    },
    "mainEntityOfPage": { "@id": `${BASE}/${path}/${resource.slug}` },
  };

  // Only add `keywords` if it's a non-empty array of strings
  if (
    resource.postschema &&
    Array.isArray(resource.postschema.keywords) &&
    resource.postschema.keywords.length > 0
  ) {
    // If each element is already a string, just spread it
    learningResource.keywords = resource.postschema.keywords.map(keyword => keyword.keyword);
  }

  // Only attempt to parse `additionalSchema` if it's a non-empty string
  if (
    resource.postschema &&
    typeof resource.postschema.additionalSchema === 'string' &&
    resource.postschema.additionalSchema.trim() !== ''
  ) {
    try {
      const extraObj = JSON.parse(resource.postschema.additionalSchema);
      // Only spread if it parsed to an object
      if (extraObj && typeof extraObj === 'object') {
        Object.assign(learningResource, extraObj);
      }
    } catch (err) {
      // If JSON.parse fails, we silently ignore it (or log if you prefer)
      console.warn(
        'resourcePostSchema: failed to parse additionalSchema:',
        err
      );
    }
  }

  graph.push(learningResource);

  // 4) Organization object (static)
  graph.push({
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    "name": "The SEO Hustler",
    "url": BASE,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE}/the-seo-hustler-horizontal-full-black.png`,
      "width": 1117,
      "height": 256,
    },
    "sameAs": [
      "https://www.linkedin.com/company/theseohustler/",
      "https://www.crunchbase.com/organization/the-seo-hustler",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "hello@theseohustler.com",
    },
    "founder": {
      "@type": "Person",
      "name": "Zac Almeida",
      "url": `${BASE}/about`,
      "sameAs": [
        "https://www.linkedin.com/in/zacalmeida/",
        "https://zacalmeida.com/",
      ],
    },
  });

  // 5) WebSite object (static)
  graph.push({
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    "url": BASE,
    "name": "The SEO Hustler",
    "description":
      "SEO guides, actionable playbooks, and tools for SEOs and small businesses to boost organic visibility in traditional and AI search.",
    "publisher": { "@id": `${BASE}/#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

  // Final schema object
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
