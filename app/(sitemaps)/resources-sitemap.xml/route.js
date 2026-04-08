
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';

export async function GET() {
  const resources = await getAllResourcePage();
  const playbooks = resources.playbooks
  const spreadsheets = resources.spreadsheets
  const ebooks = resources.ebooks


  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${playbooks.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/playbooks/${post.slug}</loc></url>`).join("")}
      ${spreadsheets.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/spreadsheets/${post.slug}</loc></url>`).join("")}
      ${ebooks.map((post) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/ebooks/${post.slug}</loc></url>`).join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}