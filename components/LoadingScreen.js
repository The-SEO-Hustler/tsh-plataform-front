'use client';

import React, { useState, useEffect } from 'react';
import { statusMessages } from '@/lib/statusMessages';
import { Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

// Status messages with their descriptions


export default function LoadingScreen({ status = 'pending' }) {
  // Get the message for the current status, or use the default 'pending' message
  const message = statusMessages[status] || statusMessages['pending'];
  const searchParams = useSearchParams();

  // State to track the progress bar animation
  const [progress, setProgress] = useState(0);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);
  const [toastShown, setToastShown] = useState(false);

  // Show toaster notification after 3 seconds
  useEffect(() => {
    if (toastShown) return;

    const timer = setTimeout(() => {
      toast.info(
        <div className="flex flex-col gap-2">
          <p>You can leave this page while the process runs in the background.</p>
          <p>You&apos;ll be notified when the process is complete.</p>
          <a href="/blog" className="text-primary underline">
            Learn more about SEO metrics
          </a>
        </div>,
        {
          duration: 10000, // Show for 10 seconds
          position: "top-right",
        }
      );
      setToastShown(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastShown]);

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

        <div className="mt-8 text-xs text-gray-500 flex items-center gap-2">
          <p>This process may take a few minutes depending on the website size. You can leave this page and check back later in this page.</p>
          <button onClick={() => {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONT_URL}/free-tools/seo-check?id=${searchParams.get('id')}`)
            toast.success("Link to analysis copied to clipboard")
          }
          }
            className="cursor-pointer"
          >
            <Copy className="h-4 w-4" color="#101828" />
          </button>
        </div>
      </div>
    </div>
  );
} 