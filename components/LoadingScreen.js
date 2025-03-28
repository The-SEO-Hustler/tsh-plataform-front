'use client';

import { useState, useEffect } from 'react';
import { Search, Image, Link, Code, LineChart, CheckCircle } from 'lucide-react';

const loadingSteps = [
  { text: 'Initializing analysis...', icon: Search },
  { text: 'Extracting URLs and links...', icon: Link },
  { text: 'Checking images and alt tags...', icon: Image },
  { text: 'Analyzing HTML structure...', icon: Code },
  { text: 'Evaluating performance metrics...', icon: LineChart },
  { text: 'Generating final report...', icon: CheckCircle },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-[2147483647] flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CurrentIcon className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {loadingSteps[currentStep].text}
          </h2>
          <p className="text-gray-600">
            This may take a few moments...
          </p>
        </div>

        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
} 