"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const FirebaseContext = createContext();

export function FirebaseProvider({ children }) {
  // Use a single state to track the current analysis.
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentContentPlanning, setCurrentContentPlanning] = useState(null);
  const [currentAdvancedKeywordAnalysis, setCurrentAdvancedKeywordAnalysis] = useState(null);
  const [currentLLMTxt, setCurrentLLMTxt] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const listenerRef = useRef(null);
  const contentPlanningListenerRef = useRef(null);
  const advancedKeywordAnalysisListenerRef = useRef(null);
  const llmtxtListenerRef = useRef(null);
  const evaluationListenerRef = useRef(null);

  const notificationSoundUrl = "/notification.mp3";
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
      type: "seo-check",
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
            // try {
            //   const audio = new Audio(notificationSoundUrl);
            //   audio
            //     .play()
            //     .catch((error) =>
            //       console.error("Audio playback failed:", error)
            //     );
            // } catch (error) {
            //   console.error("Error setting up audio notification:", error);
            // }
          }
        }
      }
    });
  };

  const trackEvaluation = (docId, url, query, userLocation, taskLocale) => {
    if (!docId) return;
    // If already tracking the same analysis, do nothing.
    if (currentEvaluation && currentEvaluation.docId === docId) return;

    // Unsubscribe previous listener, if any.
    if (evaluationListenerRef.current) {
      evaluationListenerRef.current();
      evaluationListenerRef.current = null;
    }

    // Set initial analysis state.
    setCurrentEvaluation({
      docId,
      url,
      query,
      userLocation,
      taskLocale,
      error: null,
      type: "evaluation",
      status: "pending",

    });

    // Set up a listener for the analysis document.
    evaluationListenerRef.current = onSnapshot(doc(db, "evaluations", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentEvaluation((prev) => ({
          ...prev,
          url: data.url,
          query: data.query,
          userLocation: data.userLocation,
          taskLocale: data.taskLocale,
          status: data.status,
          error: data?.error || null,
          data: data.data || null,
          updatedAt: data.updatedAt || data.completedAt || null,
        }));

        // Unsubscribe automatically when analysis is completed or failed.
        if (data.status === "completed" || data.status === "failed") {
          if (evaluationListenerRef.current) {
            evaluationListenerRef.current();
            evaluationListenerRef.current = null;
            // try {
            //   const audio = new Audio(notificationSoundUrl);
            //   audio
            //     .play()
            //     .catch((error) =>
            //       console.error("Audio playback failed:", error)
            //     );
            // } catch (error) {
            //   console.error("Error setting up audio notification:", error);
            // }
          }
        }
      }
    });
  };

  const trackLLMTxt = (docId, url) => {
    if (!docId) return;
    // If already tracking the same analysis, do nothing.
    if (currentLLMTxt && currentLLMTxt.docId === docId) return;

    // Unsubscribe previous listener, if any.
    if (llmtxtListenerRef.current) {
      llmtxtListenerRef.current();
      llmtxtListenerRef.current = null;
    }

    // Set initial analysis state.
    setCurrentLLMTxt({
      docId,
      url,
      type: "llmstxt",
      status: "pending",
      lastChecked: Date.now(),
      score: null,
      error: null,
      data: null,
    });

    // Set up a listener for the analysis document.
    llmtxtListenerRef.current = onSnapshot(doc(db, "llmstxt", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentLLMTxt((prev) => ({
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
          if (llmtxtListenerRef.current) {
            llmtxtListenerRef.current();
            llmtxtListenerRef.current = null;
            // try {
            //   const audio = new Audio(notificationSoundUrl);
            //   audio
            //     .play()
            //     .catch((error) =>
            //       console.error("Audio playback failed:", error)
            //     );
            // } catch (error) {
            //   console.error("Error setting up audio notification:", error);
            // }
          }
        }
      }
    });
  };

  const trackContentPlanning = (docId, keyword) => {
    if (!docId) return;
    // If already tracking the same analysis, do nothing.
    if (currentContentPlanning && currentContentPlanning.docId === docId) return;

    // Unsubscribe previous listener, if any.
    if (contentPlanningListenerRef.current) {
      contentPlanningListenerRef.current();
      contentPlanningListenerRef.current = null;
    }

    // Set initial analysis state.
    setCurrentContentPlanning({
      docId,
      keyword,
      type: "content-planning",
      status: "pending",
      lastChecked: Date.now(),
      score: null,
      error: null,
      data: null,
    });

    // Set up a listener for the analysis document.
    contentPlanningListenerRef.current = onSnapshot(doc(db, "contentPlanning", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentContentPlanning((prev) => ({
          ...prev,
          status: data.status,
          lastChecked: Date.now(),
          score: data.score?.score || null,
          error: data.error || null,
          data: data.data || null,
          keyword: data.keyword,
          updatedAt: data.updatedAt || data.completedAt || null,
        }));

        // Unsubscribe automatically when analysis is completed or failed.
        if (data.status === "completed" || data.status === "failed") {
          if (contentPlanningListenerRef.current) {
            contentPlanningListenerRef.current();
            contentPlanningListenerRef.current = null;
            // try {
            //   const audio = new Audio(notificationSoundUrl);
            //   audio
            //     .play()
            //     .catch((error) =>
            //       console.error("Audio playback failed:", error)
            //     );
            // } catch (error) {
            //   console.error("Error setting up audio notification:", error);
            // }
          }
        }
      }
    });
  };


  const trackAdvancedKeywordAnalysis = (docId, keyword) => {
    if (!docId) return;
    // If already tracking the same analysis, do nothing.
    if (currentAdvancedKeywordAnalysis && currentAdvancedKeywordAnalysis.docId === docId) return;

    // Unsubscribe previous listener, if any.
    if (advancedKeywordAnalysisListenerRef.current) {
      advancedKeywordAnalysisListenerRef.current();
      advancedKeywordAnalysisListenerRef.current = null;
    }

    // Set initial analysis state.
    setCurrentAdvancedKeywordAnalysis({
      docId,
      keyword,
      type: "advanced-keyword-analysis",
      status: "pending",
      lastChecked: Date.now(),
      error: null,
      data: null,
      preview: false,
    });

    // Set up a listener for the analysis document.
    advancedKeywordAnalysisListenerRef.current = onSnapshot(doc(db, "keywordAnalysis", docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentAdvancedKeywordAnalysis((prev) => ({
          ...prev,
          status: data.status,
          lastChecked: Date.now(),
          error: data.error || null,
          data: data.data || null,
          keyword: data.keyword,
          preview: data.preview || false,
          search_intent_state: data.search_intent_state || false,
          google_trends_state: data.google_trends_state || false,
          updatedAt: data.updatedAt || data.completedAt || null,
        }));

        // Unsubscribe automatically when analysis is completed or failed.
        if (data.status === "completed" || data.status === "failed") {
          if (advancedKeywordAnalysisListenerRef.current) {
            advancedKeywordAnalysisListenerRef.current();
            advancedKeywordAnalysisListenerRef.current = null;
            // console.log("playing audio 2");
            // try {
            //   console.log("playing audio 3");
            //   const audio = new Audio(notificationSoundUrl);
            //   audio
            //     .play()
            //     .catch((error) =>
            //       console.error("Audio playback failed:", error)
            //     );
            // } catch (error) {
            //   console.error("Error setting up audio notification:", error);
            // }
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


  const removeEvaluation = () => {
    if (evaluationListenerRef.current) {
      evaluationListenerRef.current();
      evaluationListenerRef.current = null;
    }
    setCurrentEvaluation(null);
  };
  const removeLLMTxt = () => {
    if (llmtxtListenerRef.current) {
      llmtxtListenerRef.current();
      llmtxtListenerRef.current = null;
    }
    setCurrentLLMTxt(null);
  };

  const removeContentPlanning = () => {
    if (contentPlanningListenerRef.current) {
      contentPlanningListenerRef.current();
      contentPlanningListenerRef.current = null;
    }
    setCurrentContentPlanning(null);
  };
  const removeAdvancedKeywordAnalysis = () => {
    console.log('removing advanced keyword analysis, current state', currentAdvancedKeywordAnalysis)
    if (advancedKeywordAnalysisListenerRef.current) {
      advancedKeywordAnalysisListenerRef.current();
      advancedKeywordAnalysisListenerRef.current = null;
    }
    setCurrentAdvancedKeywordAnalysis(null);
  };
  return (
    <FirebaseContext.Provider value={{ currentAnalysis, trackAnalysis, removeAnalysis, currentContentPlanning, trackContentPlanning, removeContentPlanning, currentAdvancedKeywordAnalysis, trackAdvancedKeywordAnalysis, removeAdvancedKeywordAnalysis, currentLLMTxt, trackLLMTxt, removeLLMTxt, currentEvaluation, trackEvaluation, removeEvaluation }}>
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
