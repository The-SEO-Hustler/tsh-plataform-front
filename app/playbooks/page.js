import React from 'react';
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import ResourceCard from '@/components/ResourceCard';
import Container from '@/components/container';
import getMetadata from '@/lib/getMetadata';
import SEO_DATA from '@/lib/seo-data';

export const metadata = getMetadata(SEO_DATA.playbooks);


export const revalidate = 3600;

async function PlaybooksPage() {
  const resources = await getAllResourcePage();
  const playbooks = resources.playbooks || [];

  return (
    <Container className="!py-16 text-foreground  bg-background">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">SEO Playbooks</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive playbooks to help you improve your website's search engine rankings.
        </p>
      </div>

      {playbooks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No playbooks found</h2>
          <p className="text-muted-foreground">Check back later for new SEO playbooks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <ResourceCard
              key={playbook.id}
              title={playbook.title}
              excerpt={playbook.excerpt}
              resourceTypes={playbook.resourceTypes}
              author={playbook.author}
              featuredImage={playbook.featuredImage}
              slug={playbook.slug}
            />
          ))}
        </div>
      )}
    </Container>
  );
}

export default PlaybooksPage; 