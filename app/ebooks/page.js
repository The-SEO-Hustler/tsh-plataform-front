import React from 'react';
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import ResourceCard from '@/components/ResourceCard';
import { Metadata } from 'next';

export const metadata = {
  title: 'SEO Ebooks | The SEO',
  description: 'Download our free SEO ebooks to learn more about search engine optimization.',
};

export const revalidate = 3600;

async function EbooksPage() {
  const resources = await getAllResourcePage();
  const ebooks = resources.ebooks || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">SEO Ebooks</h1>
        <p className="text-xl text-muted-foreground">
          Download our free SEO ebooks to learn more about search engine optimization.
        </p>
      </div>

      {ebooks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No ebooks found</h2>
          <p className="text-muted-foreground">Check back later for new SEO ebooks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <ResourceCard
              key={ebook.id}
              title={ebook.title}
              excerpt={ebook.excerpt}
              resourceTypes={ebook.resourceTypes}
              author={ebook.author}
              featuredImage={ebook.featuredImage}
              slug={ebook.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EbooksPage; 