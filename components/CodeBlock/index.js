import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  prism,
  atomDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ language, code }) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // only mark as mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // *** During SSR, just render a plain fallback ***
  if (!mounted) {
    return (
      <pre className="rounded-2xl overflow-hidden p-4 bg-gray-100 text-gray-800">
        {code}
      </pre>
    );
  }

  // *** After hydration, render with the correct theme ***
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <button
        aria-label="Copy code to clipboard"
        onClick={handleCopy}
        className="absolute top-4 right-2 border border-foreground/10 bg-card text-foreground rounded-md text-sm w-8 h-8 flex items-center justify-center"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>

      <SyntaxHighlighter
        language={language}
        style={resolvedTheme === "dark" ? atomDark : prism}
        wrapLines
        wrapLongLines
        lineProps={{ style: { flexWrap: "wrap", whiteSpace: "pre-wrap" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
