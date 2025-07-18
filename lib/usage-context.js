'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';

const UsageContext = createContext();

export function UsageProvider({ children }) {
  const [usage, setUsage] = useState({ status: 'loading' });

  useEffect(() => {
    const fetchUsage = async () => {
      const response = await fetch('/usage');
      const data = await response.json();
      console.log("usage data: ", data);
      if (data.status === 'error') {
        setUsage({ status: 'error' });
      } else {
        setUsage({ ...data, status: 'ok' });
      }
    };
    fetchUsage();
  }, []);

  return (
    <UsageContext.Provider value={{ usage, setUsage }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error("useUsage must be used within a UsageProvider");
  }
  return context;
}