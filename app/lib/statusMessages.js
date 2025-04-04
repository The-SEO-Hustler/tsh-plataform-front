import { Settings, Globe, FileText, Image, Heading, Zap, Link, Key, BarChart2 } from "lucide-react";

export const statusMessages = {
  'pending': {
    title: 'Analysis in Progress',
    descriptions: [
      'Preparing to analyze your website...',
      'Setting up the analysis environment...',
      'Initializing SEO check tools...'
    ],
    icon: Settings,
    progress: 5
  },
  'initializing': {
    title: 'Initializing Analysis',
    descriptions: [
      'Setting up the SEO analysis environment...',
      'Preparing analysis tools...',
      'Configuring crawler settings...'
    ],
    icon: Settings,
    progress: 10
  },
  'fetching': {
    title: 'Fetching Website Data',
    descriptions: [
      'Retrieving content from the target website...',
      'Downloading page resources...',
      'Crawling website structure...'
    ],
    icon: Globe,
    progress: 15
  },
  'analyzing_meta': {
    title: 'Analyzing Meta Tags',
    descriptions: [
      'Checking title, description, and other meta information...',
      'Evaluating meta tag optimization...',
      'Analyzing social media tags...'
    ],
    icon: FileText,
    progress: 20
  },
  'analyzing_images': {
    title: 'Analyzing Images',
    descriptions: [
      'Checking image alt tags and optimization...',
      'Evaluating image sizes and formats...',
      'Analyzing image loading performance...'
    ],
    icon: Image,
    progress: 25
  },
  'analyzing_headings': {
    title: 'Analyzing Headings',
    descriptions: [
      'Evaluating H1, H2, and other heading tags...',
      'Checking heading hierarchy...',
      'Analyzing heading content relevance...'
    ],
    icon: Heading,
    progress: 50
  },
  'analyzing_performance': {
    title: 'Analyzing Performance',
    descriptions: [
      'Checking page load speed and performance metrics...',
      'Evaluating Core Web Vitals...',
      'Analyzing resource loading times...'
    ],
    icon: Zap,
    progress: 55
  },
  'analyzing_links': {
    title: 'Analyzing Links',
    descriptions: [
      'Checking for broken links and internal/external link structure...',
      'Evaluating link quality and relevance...',
      'Analyzing anchor text optimization...'
    ],
    icon: Link,
    progress: 75
  },
  'analyzing_keywords': {
    title: 'Analyzing Keywords',
    descriptions: [
      'Evaluating keyword usage and optimization...',
      'Analyzing keyword density and placement...',
      'Checking for keyword cannibalization...'
    ],
    icon: Key,
    progress: 94
  },
  'compiling_results': {
    title: 'Compiling Results',
    descriptions: [
      'Finalizing the SEO analysis report...',
      'Generating recommendations...',
      'Preparing your detailed SEO insights...'
    ],
    icon: BarChart2,
    progress: 100
  },
  'completed': {
    title: 'Compiling Results',
    descriptions: [
      'Finalizing the SEO analysis report... ',
      'Generating recommendations...',
      'Preparing your detailed SEO insights...'
    ],
    icon: BarChart2,
    progress: 100
  },
};