"use client";

import { ThemeProvider } from "next-themes";

export function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
