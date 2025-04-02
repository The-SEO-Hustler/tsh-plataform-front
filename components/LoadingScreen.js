'use client';

import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Settings, 
  Globe, 
  FileText, 
  Image, 
  Heading, 
  Zap, 
  Link, 
  Key, 
  BarChart2,
  // Add more Lucide icons as needed
} from 'lucide-react';

// Status messages with their descriptions
const statusMessages = {
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

export default function LoadingScreen({ status = 'pending' }) {
  // Get the message for the current status, or use the default 'pending' message
  const message = statusMessages[status] || statusMessages['pending'];
  
  // State to track the progress bar animation
  const [progress, setProgress] = useState(0);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  
  // Animate the progress bar when status changes
  useEffect(() => {
    // Get the target progress value
    const targetProgress = message.progress;
    
    // Animate to the target progress value
    const duration = 1000; // 1 second animation
    const steps = 20;
    const increment = (targetProgress - progress) / steps;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setProgress(prev => Math.min(prev + increment, targetProgress));
      } else {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [status, message.progress, progress]);
  
  // Rotate through descriptions
  useEffect(() => {
    const descriptionTimer = setInterval(() => {
      setCurrentDescriptionIndex(prev => 
        (prev + 1) % message.descriptions.length
      );
    }, 3000); // Change description every 3 seconds
    
    return () => clearInterval(descriptionTimer);
  }, [message.descriptions.length]);

  // Get the current description
  const currentDescription = message.descriptions[currentDescriptionIndex];
  
  // Get the icon component
  const IconComponent = message.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center relative h-20 w-20 mx-auto mb-6">
          <Loader2 className="h-20 w-20 animate-spin text-primary absolute top-0" />
          <IconComponent className="h-10 w-10 text-primary absolute top-5" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
        <div className='h-16 flex items-center justify-center'>
          
        <p className="text-gray-600 mb-3">{currentDescription}</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>This process may take a few minutes depending on the website size.</p>
        </div>
      </div>
    </div>
  );
} 