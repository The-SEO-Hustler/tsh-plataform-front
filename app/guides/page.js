import React from 'react';
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import ResourceCard from '@/components/ResourceCard';
import Container from '@/components/container';
export const metadata = {
  title: 'SEO Guides | The SEO',
  description: 'Comprehensive SEO guides to help you improve your website\'s search engine rankings.',
};

export const revalidate = 3600;

async function GuidesPage() {
  const resources = await getAllResourcePage();
  const guides = resources.guides || [];

  return (
    <Container className="!py-16">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">SEO Guides</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guides to help you improve your website's search engine rankings.
        </p>
      </div>

      {guides.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No guides found</h2>
          <p className="text-muted-foreground">Check back later for new SEO guides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <ResourceCard
              key={guide.id}
              title={guide.title}
              excerpt={guide.excerpt}
              resourceTypes={guide.resourceTypes}
              author={guide.author}
              featuredImage={guide.featuredImage}
              slug={guide.slug}
            />
          ))}
        </div>
      )}
    </Container>
  );
}

export default GuidesPage; 