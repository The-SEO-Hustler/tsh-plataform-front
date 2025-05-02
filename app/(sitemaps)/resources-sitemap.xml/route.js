
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';

export async function GET() {
  const resources = await getAllResourcePage();
  const playbooks = resources.playbooks
  const spreadsheets = resources.spreadsheets
  const ebooks = resources.ebooks


  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${playbooks.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/playbooks/${post.slug}</loc><lastmod>${post.modified}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`).join("")}
      ${spreadsheets.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/spreadsheets/${post.slug}</loc><lastmod>${post.modified}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`).join("")}
      ${ebooks.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/ebooks/${post.slug}</loc><lastmod>${post.modified}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`).join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}