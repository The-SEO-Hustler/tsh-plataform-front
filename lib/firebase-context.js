"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

const FirebaseContext = createContext(undefined);

export function FirebaseProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const listenerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser || null);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

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
        ...(data.diff ? { diff: data.diff } : {}),
        ...(data.screenshotBase64
          ? { screenshotBase64: data.screenshotBase64 }
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
        ...(data.recommendations
          ? { recommendations: data.recommendations }
          : {}),
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
      value={{
        currentAnalysis,
        trackAnalysis,
        clearAnalysis,
        user,
        authLoading,
        loginWithGoogle,
        logout,
      }}
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
