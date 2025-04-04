"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  // Use a single state to track the current analysis.
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const listenerRef = useRef(null);
  const notificationSoundUrl = "/notification.wav";
  // Only one analysis is tracked at a time.
  const trackAnalysis = (docId, url) => {
    if (!docId) return;
    // If already tracking the same analysis, do nothing.
    if (currentAnalysis && currentAnalysis.docId === docId) return;

    // Unsubscribe previous listener, if any.
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }

    // Set initial analysis state.
    setCurrentAnalysis({
      docId,
      url,
      status: "pending",
      lastChecked: Date.now(),
      score: null,
      error: null,
      data: null,
    });

    // Set up a listener for the analysis document.
    listenerRef.current = onSnapshot(doc(db, "seoAnalyses", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentAnalysis((prev) => ({
          ...prev,
          status: data.status,
          lastChecked: Date.now(),
          score: data.score?.score || null,
          error: data.error || null,
          data: data.data || null,
          url: data.url,
          updatedAt: data.updatedAt || data.completedAt || null,
        }));

        // Unsubscribe automatically when analysis is completed or failed.
        if (data.status === "completed" || data.status === "failed") {
          if (listenerRef.current) {
            listenerRef.current();
            listenerRef.current = null;

            // Try to play notification sound, but handle autoplay restrictions gracefully
            try {
              const audio = new Audio(notificationSoundUrl);
              // Set audio to be muted by default to avoid autoplay restrictions
              audio.muted = true;

              // Try to play the audio
              audio.play()
                .then(() => {
                  // If successful, unmute the audio
                  audio.muted = false;
                })
                .catch((error) => {
                  console.log("Audio playback restricted by browser policy:", error);
                  // Show a toast notification as a fallback
                  toast.success(`Analysis ${data.status}! Check the results.`, {
                    duration: 5000,
                    position: "top-right",
                  });
                });
            } catch (error) {
              console.error("Error setting up audio notification:", error);
              // Show a toast notification as a fallback
              toast.success(`Analysis ${data.status}! Check the results.`, {
                duration: 5000,
                position: "top-right",
              });
            }
          }
        }
      }
    });
  };


  // Remove the current analysis.
  const removeAnalysis = () => {
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }
    setCurrentAnalysis(null);
  };

  return (
    <FirebaseContext.Provider value={{ currentAnalysis, trackAnalysis, removeAnalysis }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
