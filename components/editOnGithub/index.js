// components/EditOnGitHub.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getFilePathForPathname } from "@/lib/githuMap";

export default function EditOnGitHub() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toolbarSelector = [
      "nextjs-portal",
      "vercel-live-feedback",
      "nextjs-portal-toolbar",
      "#vercel-toolbar",
      "iframe[src*=\"_vercel\"][title=\"Vercel\"]"
    ].join(",");

    if (typeof document !== "undefined" && document.querySelector(toolbarSelector)) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const githubBase = "https://github.com/The-SEO-Hustler/tsh-plataform-front/tree/main";
  // Use the helper function that supports both exact matches and wildcard patterns
  let filePath = getFilePathForPathname(pathname);
  // …if it wasn't found, return null
  if (!filePath) {
    return null;
  }

  const editUrl = githubBase + filePath;

  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noopener"
      className="fixed border border-foreground/10 no-underline shadow-lg bottom-4 left-4 z-50 bg-primary text-black px-3 py-2 rounded-lg hover:opacity-90"
      title="Edit this page on GitHub"
    >
      ✏️ Edit
    </a>
  );
}
