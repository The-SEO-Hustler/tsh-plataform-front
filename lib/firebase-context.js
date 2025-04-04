"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
            try {
              const audio = new Audio(notificationSoundUrl);
              audio
                .play()
                .catch((error) =>
                  console.error("Audio playback failed:", error)
                );
            } catch (error) {
              console.error("Error setting up audio notification:", error);
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
