
import { getAllPostsWithSlug } from "@/lib/wordpress/posts/getAllPostsWithSlug";

export async function GET() {
  const posts = await getAllPostsWithSlug();

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(({ node: post }) => `<url><loc>${process.env.NEXT_PUBLIC_FRONT_URL}/blog/${post.slug}</loc></url>`).join("")}
    </urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}