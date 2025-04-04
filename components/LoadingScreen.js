'use client';

import React, { useState, useEffect } from 'react';
import { statusMessages } from '@/app/lib/statusMessages';
import { Loader2 } from 'lucide-react';

// Status messages with their descriptions


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