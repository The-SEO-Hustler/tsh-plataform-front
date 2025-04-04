'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SEOMetricsDoc() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Why SEO Metrics Matter</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">
          Search Engine Optimization (SEO) metrics are crucial indicators that help you understand how well your website performs in search engine results and how effectively it meets user needs. These metrics provide valuable insights that can guide your content strategy and website optimization efforts.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Key SEO Metrics Explained</h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Organic Traffic</h3>
            <p>
              Organic traffic represents visitors who find your website through unpaid search results. This metric is essential because it shows how effectively your SEO efforts are driving qualified visitors to your site.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Keyword Rankings</h3>
            <p>
              Keyword rankings indicate where your website appears in search results for specific keywords. Tracking these rankings helps you understand your visibility for target terms and identify opportunities for improvement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Click-Through Rate (CTR)</h3>
            <p>
              CTR measures the percentage of users who click on your website in search results. A high CTR indicates that your title tags and meta descriptions are compelling and relevant to users&apos; search intent.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Bounce Rate</h3>
            <p>
              Bounce rate shows the percentage of visitors who leave your site after viewing only one page. A high bounce rate might indicate that your content isn&apos;t meeting user expectations or that your site needs optimization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Page Speed</h3>
            <p>
              Page speed is crucial for both user experience and SEO. Faster-loading pages tend to rank better in search results and provide a better user experience, leading to higher engagement and conversion rates.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to Use SEO Metrics</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="mb-4">
            To effectively use SEO metrics:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Set clear, measurable goals for your SEO efforts</li>
            <li>Track metrics consistently over time to identify trends</li>
            <li>Compare your performance against industry benchmarks</li>
            <li>Use insights to make data-driven decisions about your content and website</li>
            <li>Focus on metrics that align with your business objectives</li>
          </ul>
        </div>

        <div className="bg-primary/10 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-2">Ready to Improve Your SEO?</h3>
          <p className="mb-4">
            Our SEO analysis tool provides comprehensive insights into your website&apos;s performance and actionable recommendations for improvement.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Start Your SEO Analysis
          </Link>
        </div>
      </div>
    </div>
  );
} 