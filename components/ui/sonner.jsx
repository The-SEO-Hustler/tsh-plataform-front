"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group text-foreground"
      style={{
        "--normal-bg": "rgb(var(--popover))",
        "--normal-text": "rgb(var(--popover-foreground))",
        "--normal-border": "rgb(var(--border))",
      }}
      {...props}
    />
  );
};

export { Toaster };
