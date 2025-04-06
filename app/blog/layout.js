export const metadata = {
  title: 'Blog | SEO Check Tool',
  description: 'Latest SEO tips, strategies, and insights to help improve your website\'s search engine rankings.',
};

export default function BlogLayout({ children }) {
  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
} 