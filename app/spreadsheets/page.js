import React from 'react';
import { getAllResourcePage } from '@/lib/wordpress/resources/getAllResourcePage';
import ResourceCard from '@/components/ResourceCard';
import { Metadata } from 'next';

export const metadata = {
  title: 'SEO Spreadsheets | The SEO',
  description: 'Useful SEO spreadsheets to help you track and improve your website\'s performance.',
};

export const revalidate = 3600;

async function SpreadsheetsPage() {
  const resources = await getAllResourcePage();
  const spreadsheets = resources.spreadsheets || [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">SEO Spreadsheets</h1>
        <p className="text-xl text-muted-foreground">
          Useful spreadsheets to help you track and improve your website's performance.
        </p>
      </div>

      {spreadsheets.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No spreadsheets found</h2>
          <p className="text-muted-foreground">Check back later for new SEO spreadsheets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spreadsheets.map((spreadsheet) => (
            <ResourceCard
              key={spreadsheet.id}
              title={spreadsheet.title}
              excerpt={spreadsheet.excerpt}
              resourceTypes={spreadsheet.resourceTypes}
              author={spreadsheet.author}
              featuredImage={spreadsheet.featuredImage}
              slug={spreadsheet.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SpreadsheetsPage; 