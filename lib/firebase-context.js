"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const FirebaseContext = createContext(undefined);

export function FirebaseProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const listenerRef = useRef(null);

  const trackAnalysis = ({ type, docId, collection, meta = {} }) => {
    if (!docId) return;
    // if same job, do nothing
    if (currentAnalysis?.docId === docId) return;

    // tear down previous
    listenerRef.current?.();
    listenerRef.current = null;

    // set initial
    setCurrentAnalysis({
      docId,
      type,
      status: "pending",
      lastChecked: Date.now(),
      ...meta,
    });

    // subscribe
    listenerRef.current = onSnapshot(doc(db, collection, docId), (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      setCurrentAnalysis((prev) => ({
        ...prev,
        status: data.status,
        lastChecked: Date.now(),
        updatedAt: data.updatedAt || data.completedAt,
        error: data.error ?? null,
        data: data.data ?? null,
        // propagate any fields that live in the doc:
        ...(data.google_trends_state
          ? { google_trends_state: data.google_trends_state }
          : {}),
        ...(data.search_intent_state
          ? { search_intent_state: data.search_intent_state }
          : {}),
        ...(data.score ? { score: data.score } : {}),
        ...(data.sendToEmail ? { sendToEmail: data.sendToEmail } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.url ? { url: data.url } : {}),
        ...(data.keyword ? { keyword: data.keyword } : {}),
        ...(data.query ? { query: data.query } : {}),
        ...(data.userLocation ? { userLocation: data.userLocation } : {}),
        ...(data.taskLocale ? { taskLocale: data.taskLocale } : {}),
        ...(data.preview !== undefined ? { preview: data.preview } : {}),
        ...(data.cost ? { cost: data.cost } : {}),
        ...(data.currentUrl ? { currentUrl: data.currentUrl } : {}),
        // etc.
      }));

      // auto-unsubscribe
      if (data.status === "completed" || data.status === "failed") {
        listenerRef.current?.();
        listenerRef.current = null;
      }
    });
  };

  const clearAnalysis = () => {
    listenerRef.current?.();
    listenerRef.current = null;
    setCurrentAnalysis(null);
  };

  return (
    <FirebaseContext.Provider
      value={{ currentAnalysis, trackAnalysis, clearAnalysis }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase must be inside FirebaseProvider");
  return ctx;
}
