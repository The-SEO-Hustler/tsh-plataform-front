import { Settings, Globe, FileText, Image, Heading, Zap, Link, Key, BarChart2, User } from "lucide-react";

export const statusMessages = {
  'processing': {
    title: 'Processing the Request..',
    descriptions: [
      'Preparing to analyze your website...',
      'Setting up the analysis environment...',
      'Initializing SEO check tools...'
    ],
    icon: Settings,
    progress: 5
  },
  'part1': {
    title: 'Initial Assessment & Gatekeeper Checks',
    descriptions: [
      'Determining Page Purpose & Type',
      'Checking Screen for Harmful Purpose',
      'Identifying YMYL'
    ],
    icon: Settings,
    progress: 20
  },
  'part2': {
    title: 'Page Quality (PQ) Evaluation',
    descriptions: [
      'Analyzing Page Content ',
      'Assessing Website',
      'Evaluating Main Content'
    ],
    icon: Settings,
    progress: 40
  },
  'part3': {
    title: 'Assigning Page Quality (PQ) Rating',
    descriptions: [
      'Synthesizing findings from Part 2 ',
    ],
    icon: Settings,
    progress: 60
  },
  'part4': {
    title: 'Evalating Needs Met (NM) Rating',
    descriptions: [
      'Understanding the Query & User Intent ',
    ],
    icon: Settings,
    progress: 75
  },
  'part5': {
    title: ' Assigning Needs Met (NM) Rating',
    descriptions: [
      'Assigning a rating based on how well the result satisfies the likely user intent(s).',
    ],
    icon: Settings,
    progress: 75
  },

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

  'extracting_headings': {
    title: 'Extracting Headings',
    descriptions: [
      'Fetching websites...',
    ],
    icon: Heading,
    progress: 30
  },
  'generating_user_persona': {
    title: 'Generating User Persona',
    descriptions: [
      'Generating user persona...',
    ],
    icon: User,
    progress: 45
  },
  'getting_content_structure': {
    title: 'Getting Content Structure',
    descriptions: [
      'Analyzing search results...',
      'Preparing SEO insights...'
    ],
    icon: FileText,
    progress: 70
  },
  'getting_keyword_data': {
    title: 'Getting Keyword Data',
    descriptions: [
      'Fetching keyword data...',
    ],
    icon: Key,
    progress: 25
  },
  'extracting_serp_pages': {
    title: 'Extracting SERP Pages',
    descriptions: [
      'Analyzing SERP page structure...',
    ],
    icon: FileText,
    progress: 70
  },
  'classifying_page_structures': {
    title: 'Classifying Page Structures',
    descriptions: [
      'Classifying page structures...',
    ],
    icon: FileText,
    progress: 85
  },
  'classifying_search_intent': {
    title: 'Classifying Search Intent',
    descriptions: [
      'Classifying search intent...',
    ],
    icon: FileText,
    progress: 95
  },
  'getting_serp_data': {
    title: 'Getting SERP Data',
    descriptions: [
      'Fetching SERP data from Google...',
      'Analyzing search results...',
    ],
    icon: Globe,
    progress: 50
  },
  'getting_keyword_serp_data': {
    title: 'Getting Keyword SERP Data',
    descriptions: [
      'Fetching SERP data from Google...',
      'Analyzing search results...',
    ],
    icon: Globe,
    progress: 90
  },
  'fetching': {
    title: 'Fetching Website Data',
    descriptions: [
      'Launching the browser...',
      'Opening the target website...',
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