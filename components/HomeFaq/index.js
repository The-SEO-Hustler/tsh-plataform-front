import React from "react";

const FAQS = [
  {
    q: "Are these SEO tools actually free, or is there a paywall?",
    a: "The core auditing tools are 100% free with no credit card and no account required. We monetize through our advanced premium playbooks, which allows us to keep the tactical analysis tools open to the community.",
  },
  {
    q: "Does the SEO Checker execute JavaScript to audit the DOM?",
    a: "Yes. Unlike legacy crawlers that only parse raw HTML, our tool renders the client-side JavaScript to analyze the final, hydrated DOM exactly how Googlebot sees it.",
  },
  {
    q: "How is this different from Ahrefs or Semrush?",
    a: "We aren't replacing enterprise crawlers for 100,000-page enterprise audits. The SEO Hustler is built for zero-friction, tactical, page-level analysis. You don't need to configure a massive project; just drop a URL and get instant, actionable E-E-A-T and technical fixes.",
  },
  {
    q: "Is my audit data stored or shared?",
    a: "If you run a guest scan, the data is ephemeral and cleared. If you create a free account, your history is stored securely in your dashboard so you can track your domain's progress over time. We do not sell your audit data.",
  },
];

export default function HomeFaq() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-elevation-2 overflow-hidden">
          <div className="px-6 py-10 md:px-10 md:py-12 border-b border-border bg-foreground/[0.03]">
            <p className="text-xs font-mono text-foreground/60">faq.schema</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-foreground">
              The hard questions, answered.
            </h2>
            <p className="mt-3 text-lg text-foreground/70 max-w-3xl">
              Built for technical SEOs who want clarity, not marketing fluff.
            </p>
          </div>

          <div className="px-6 md:px-10 py-6 md:py-8">
            <div className="w-full">
              {FAQS.map((item, idx) => (
                <details
                  key={item.q}
                  open={idx === 0}
                  className="group border-b border-border/70 py-4"
                >
                  <summary className="list-none cursor-pointer select-none flex items-start justify-between gap-4">
                    <span className="text-base md:text-lg font-bold text-foreground">
                      {item.q}
                    </span>
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background text-foreground/70 transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pt-3 text-foreground/70 text-base leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

