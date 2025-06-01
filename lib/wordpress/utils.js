import Logo from '../../public/the-seo-hustler-horizontal-white-logo.png'
const cheerio = require('cheerio')

/**
 * Transforms URLs in content to use relative paths
 * @param {string} content - The content to transform
 * @returns {string} - The transformed content
 */
export function transformContentUrls(url) {
  const backToReplace = String(process.env.BACK_SITE_URL) + "index.php/";

  // regex pattern to match date in URL
  const datePattern = /\/\d{4}\/\d{2}\/\d{2}/g;

  // Regex pattern to match backToReplace in URL
  const backToReplacePattern = new RegExp(backToReplace, "g");

  // Replace date pattern with an empty string
  let newUrl = url?.replace(datePattern, "") || url;

  // Replace backToReplace with NEXT_PUBLIC_FRONT_SITE_URL
  newUrl = newUrl.replace(
    backToReplacePattern,
    `${process.env.NEXT_PUBLIC_FRONT_SITE_URL}/`
  );

  newUrl = newUrl.replaceAll("/seo_term/", "/seo-glossary/");
  return newUrl;
}


/**
 * Extracts SEO terms from content
 * @param {string} content - The content to analyze
 * @returns {Promise<Object>} - SEO terms
 */
export async function getSeoTerm(content) {
  if (!content) return {};

  // This is a placeholder implementation
  // In a real application, you would implement more sophisticated SEO analysis
  const seoTerms = {
    title: '',
    description: '',
    keywords: [],
  };

  // Extract title from first h1 or h2
  const titleMatch = content.match(/<h[12][^>]*>(.*?)<\/h[12]>/);
  if (titleMatch) {
    seoTerms.title = titleMatch[1].replace(/<[^>]*>/g, '');
  }

  // Extract description from first paragraph
  const descMatch = content.match(/<p[^>]*>(.*?)<\/p>/);
  if (descMatch) {
    seoTerms.description = descMatch[1].replace(/<[^>]*>/g, '').substring(0, 160);
  }

  // Extract keywords from headings
  const headingMatches = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g) || [];
  seoTerms.keywords = headingMatches
    .map(match => match.replace(/<[^>]*>/g, ''))
    .filter(Boolean)
    .slice(0, 5);

  return seoTerms;
}

/**
 * Creates schema markup for a post
 * @param {Object} post - The post data
 * @returns {Object} - Schema markup
 */


export const createPostSchema = (post) => {

  if (!post) return

  const excerpt_element = cheerio.load(post.excerpt)
  const post_path_url = process.env.NEXT_PUBLIC_FRONT_SITE_URL + "/blog/" + post.slug;
  const seo = {
    opengraphUrl: post_path_url,
    metaDesc: post.excerpt,
    metaRobotsNofollow: "follow",
    metaRobotsNofollow: "index",
    opengraphAuthor: post.author.node.name,
    opengraphType: 'Article',
    opengraphDescription: post.excerpt,
    opengraphImage: { sourceUrl: post.featuredImage.node.sourceUrl },
    opengraphModifiedTime: post.modified,
    opengraphModifiedTime: post.date,
    opengraphSiteName: "The SEO Hustler",
    opengraphTitle: post.title + "- The SEO Hustler",
    title: post.title + "- The SEO Hustler"
  };
  const schemaDetails = {
    "@context": "https://schema.org",
    "@type": "Article",
    "url": post_path_url,
    "dateCreated": post.date,
    "datePublished": post.date,
    "dateModified": post.modified,
    "headline": post.title,
    "name": post.title,
    "description": excerpt_element.text(),
    "mainEntityOfPage": post_path_url,
    "image": post.featuredImage.node.sourceUrl,
    "author": {
      "@type": "Person",
      "name": post.author.node.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": "The SEO Hustler",
      "url": process.env.NEXT_PUBLIC_FRONT_SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_FRONT_SITE_URL}${Logo.src}`,
        "height": Logo.height,
        "width": Logo.width
      }
    }

  };

  const stringSchema = JSON.stringify(schemaDetails);
  seo.schemaDetails = stringSchema;
  return seo;
};
