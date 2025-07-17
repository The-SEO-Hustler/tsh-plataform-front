'use client';

import React, { useState, useEffect } from 'react';
import { statusMessages } from '@/lib/statusMessages';
import { Loader2, Copy, Mail, Bell } from 'lucide-react';
import { getPathname } from '@/lib/getpathname';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Status messages with their descriptions

export default function LoadingScreen({ status = 'pending', type, docId, collection, sendToEmail }) {
  // Get the message for the current status, or use the default 'pending' message
  const message = statusMessages[status] || statusMessages['pending'];
  const searchParams = useSearchParams();

  // State to track the progress bar animation
  const [progress, setProgress] = useState(0);
  const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

  // Email notification states
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(sendToEmail || false);

  // Load email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);
  useEffect(() => {
    setEmailSubmitted(sendToEmail || false);
  }, [sendToEmail]);


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

  // Handle email notification submission
  const handleEmailSubmit = async (e) => {
    console.log("handleEmailSubmit", docId, collection, email);
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!docId || !collection) {
      toast.error('Unable to save email preferences');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save email to localStorage
      localStorage.setItem('userEmail', email);

      // Update Firebase document
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, {
        sendToEmail: true,
        email: email
      });

      setEmailSubmitted(true);
      toast.success('Email notification enabled! You\'ll receive an email when the process is complete.');
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to save email preferences. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the current description
  const currentDescription = message.descriptions[currentDescriptionIndex];

  // Get the icon component
  const IconComponent = message.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="text-center md:max-w-md p-8 bg-card rounded-xl shadow-lg max-w-[90%]">
        <div className="flex justify-center relative h-20 w-20 mx-auto mb-6">
          <Loader2 className="h-20 w-20 animate-spin text-primary absolute top-0" />
          <IconComponent className="h-10 w-10 text-primary absolute top-5" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
        <div className='h-16 flex items-center justify-center'>
          <p className="text-foreground/80 mb-3">{currentDescription}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-foreground/80 rounded-full h-2.5 mb-6">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Email Notification Section */}
        {!emailSubmitted && (
          <div className="mb-6 p-4 bg-accent/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Get notified when this process is complete</h3>
            </div>

            {!showEmailForm ? (
              <div className="space-y-2">
                <p className="text-xs text-foreground/70 mb-2">
                  Receive an email notification when this specific analysis is finished
                </p>
                <Button
                  onClick={() => setShowEmailForm(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enable Email Notifications
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Enable Notifications'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmailForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {emailSubmitted && (
          <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Email notifications enabled for this process</span>
            </div>
          </div>
        )}

        <div className="mt-8 text-[11px] text-foreground/80 flex items-center gap-2">
          <p>This process may take a few minutes depending on the process size. You can leave this page and check back later in this page.</p>
          <button onClick={() => {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONT_URL}${getPathname(type)}/result?id=${searchParams.get('id')}`)
            toast.success("Link to analysis copied to clipboard")
          }
          }
            className="cursor-pointer"
          >
            <Copy className="h-4 w-4 text-foreground/80" />
          </button>
        </div>
      </div>
    </div>
  );
} 