"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { resolvedTheme } = useTheme()

  return (
    (<Sonner
      theme={resolvedTheme}
      className="toaster group text-foreground"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)"
        }
      }
      {...props} />)
  );
}

export { Toaster }
