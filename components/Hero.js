"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import HeroTemplate from "@/components/HeroTemplate";
import { tools } from "@/lib/toolsMetaData";

import SeoCheckEmbbed from "@/components/seoCheckForm";
import SearchIntentEmbbed from "@/components/searchIntentForm";
import EvaluationForm from "@/components/evaluationForm";
import AdvancedKeywordForm from "@/components/advancedKeywordForm";
import ContentPlanningForm from "@/components/contentPlanningForm";
import LLMForm from "@/components/LLMForm";
import RecaptchaProvider from "@/components/RecaptchaProvider";

function ToolWithRecaptcha({ children }) {
  return <RecaptchaProvider>{children}</RecaptchaProvider>;
}

function EeatEmbbed() {
  return (
    <ToolWithRecaptcha>
      <EvaluationForm />
    </ToolWithRecaptcha>
  );
}

function AdvancedKeywordEmbbed() {
  return (
    <ToolWithRecaptcha>
      <AdvancedKeywordForm />
    </ToolWithRecaptcha>
  );
}

function ContentPlanningEmbbed() {
  return (
    <ToolWithRecaptcha>
      <ContentPlanningForm />
    </ToolWithRecaptcha>
  );
}

function LlmsTxtEmbbed() {
  return (
    <ToolWithRecaptcha>
      <LLMForm />
    </ToolWithRecaptcha>
  );
}

const TOOL_COMPONENT_BY_HREF = {
  "/seo-check": SeoCheckEmbbed,
  "/search-intent": SearchIntentEmbbed,
  "/eeat-checker": EeatEmbbed,
  "/advanced-keyword-analysis": AdvancedKeywordEmbbed,
  "/content-planning": ContentPlanningEmbbed,
  "/llms-txt-generator": LlmsTxtEmbbed,
};

function renderToolIcon(icon) {
  // Many icons in `toolsMetaData` are authored at 56x56 (inline SVG + lucide).
  // Force 28x28 at render time to avoid hydration-time resizing and CLS.
  if (!React.isValidElement(icon)) return icon;

  const className = [icon.props?.className, "h-7 w-7"]
    .filter(Boolean)
    .join(" ");

  return React.cloneElement(icon, {
    width: 28,
    height: 28,
    size: 28,
    className,
  });
}

export default function Hero({ initialTool }) {
  const toolOptions = useMemo(
    () => tools.filter((t) => TOOL_COMPONENT_BY_HREF[t.href]),
    [],
  );

  const defaultHref = toolOptions[0]?.href || "/seo-check";
  const initialHref =
    typeof initialTool === "string"
      ? `/${initialTool}`.replace(/\/+/, "/").replace(/\/$/, "")
      : undefined;

  const resolvedInitial =
    initialHref && TOOL_COMPONENT_BY_HREF[initialHref]
      ? initialHref
      : defaultHref;

  const [selectedHref, setSelectedHref] = useState(resolvedInitial);
  const [jsEnabled, setJsEnabled] = useState(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  useEffect(() => {
    // If user lands on /?tool=..., strip query to avoid duplicate homepage URLs.
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    if (u.searchParams.has("tool")) {
      u.searchParams.delete("tool");
      const next =
        u.pathname +
        (u.searchParams.toString() ? `?${u.searchParams}` : "") +
        u.hash;
      window.history.replaceState(null, "", next);
    }
  }, []);

  const SelectedTool =
    TOOL_COMPONENT_BY_HREF[selectedHref] || TOOL_COMPONENT_BY_HREF[defaultHref];
  const selectedToolMeta =
    toolOptions.find((t) => t.href === selectedHref) || toolOptions[0];

  return (
    <HeroTemplate noBg className={"!py-0"}>
      <Container className="relative z-10">
        <div className="tsh-hero">
          {/* Two-column hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center min-h-[80vh] border-b border-black/10 dark:border-foreground/10">
            <div className="text-left tsh-hero__left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black dark:text-foreground leading-tight text-foreground">
                Professional SEO tools.
                <br />
                <span className="text-primary">Zero paywalls.</span>
              </h1>
              <p className="mt-5 text-lg md:text-xl dark:text-foreground/80 max-w-xl">
                Select a tool to get started. Analyze your domain, check E-E-A-T
                signals, or reverse-engineer search intent in minutes.
              </p>

              {/* Intentionally no secondary CTA here; focus stays on the widget input. */}
            </div>

            <div className="tsh-widget tsh-hero__right rounded-2xl border border-white/10 dark:border-foreground/10 bg-card/50 backdrop-blur-md p-5 md:p-6 shadow-xl">
              <div className="mb-4">
                <div className="tsh-toolbar relative">
                  <div className="tsh-toolbar__scroller flex items-stretch gap-2 overflow-x-auto overscroll-x-contain pr-8 pb-1 snap-x snap-mandatory py-1">
                    {toolOptions.map((tool, idx) => {
                      const active = tool.href === selectedHref;

                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={[
                            "tool-tile group",
                            // stable, no-FOUC layout styles (SSR + hydrated match)
                            "snap-start shrink-0",
                            "w-[86px] h-[86px] flex flex-col items-center justify-center",
                            "gap-2 px-2.5 py-2.5 rounded-[14px]",
                            "no-underline",
                            "border transition-[transform,background,border-color,box-shadow] duration-200",
                            // light mode (readable)
                            "text-foreground/90 bg-foreground/5 border-foreground/10",
                            "hover:-translate-y-0.5 hover:bg-foreground/10 hover:border-foreground/20",
                            // dark mode
                            "dark:text-white/90 dark:bg-black/15 dark:border-white/15",
                            "dark:hover:bg-black/20 dark:hover:border-white/30",
                            // active state
                            active
                              ? "!border-primary/90 !bg-primary/10 !border-2"
                              : "",
                          ].join(" ")}
                          style={{ "--i": String(idx) }}
                          onClick={(e) => {
                            if (!jsEnabled) return;
                            e.preventDefault();
                            setSelectedHref(tool.href);
                          }}
                          aria-current={active ? "true" : undefined}
                        >
                          <span
                            className="tool-tile__icon grid place-items-center h-[34px] w-[34px] rounded-[10px] text-foreground dark:text-primary"
                            aria-hidden="true"
                          >
                            {renderToolIcon(tool.Icon)}
                          </span>
                          <span className="tool-tile__label text-[11px] font-extrabold leading-[1.05] text-center tracking-[-0.01em] line-clamp-2 !no-underline text-foreground ">
                            {tool.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-foreground/70 dark:text-foreground/70">
                    Selected tool
                  </p>
                  <h2 className="text-xl font-bold text-foreground dark:text-foreground truncate">
                    {selectedToolMeta?.title}
                  </h2>
                </div>
                <Link
                  href={selectedHref}
                  className="text-xs dark:text-primary whitespace-nowrap text-foreground !no-underline"
                >
                  View tool →
                </Link>
              </div>

              <div className=" py-4">
                <SelectedTool />
              </div>

              {!jsEnabled && (
                <p className="mt-3 text-xs text-foreground/60 dark:text-foreground/60">
                  Tip: enable JavaScript to switch tools without reloading.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        /* Keep these styles local to the homepage hero */
        .tsh-hero {
          position: relative;
        }
        .tsh-hero__left {
          animation: heroLeftIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .tsh-hero__right {
          animation: heroRightIn 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 90ms;
        }
        .tsh-hero .tool-tile {
          animation: heroTileIn 620ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: calc(var(--i) * 60ms + 140ms);
        }
        @keyframes heroLeftIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroRightIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroTileIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tsh-hero__left,
          .tsh-hero__right,
          .tsh-hero .tool-tile {
            animation: none !important;
          }
        }
        .tsh-hero:before {
          content: "";
          position: absolute;
          inset: -120px -80px -120px -80px;
          pointer-events: none;
          background: radial-gradient(
            700px 420px at 72% 40%,
            rgba(255, 221, 0, 0.18),
            rgba(255, 221, 0, 0.02) 55%,
            rgba(0, 0, 0, 0) 70%
          );
          filter: blur(6px);
          opacity: 0.9;
        }
        .tsh-widget {
          position: relative;
          z-index: 1;
        }
        .tsh-toolbar {
          position: relative;
        }
        .tsh-toolbar__scroller {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge legacy */
          scroll-snap-type: x mandatory;
          scroll-padding-left: 6px;
          scroll-padding-right: 22px;
        }
        .tsh-toolbar__scroller::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .tsh-toolbar__fade {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 52px;
          pointer-events: none;
          background: linear-gradient(
            to left,
            rgba(248, 247, 243, 0.98),
            rgba(248, 247, 243, 0)
          );
        }
        :global(.dark) .tsh-toolbar__fade {
          background: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0)
          );
        }
        .tsh-hero .tool-tile__icon :global(svg) {
          width: 28px !important;
          height: 28px !important;
          max-width: 28px;
          max-height: 28px;
        }
      `}</style>
    </HeroTemplate>
  );
}
