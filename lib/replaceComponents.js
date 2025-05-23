import parse, { domToReact } from "html-react-parser";
import SeoCheckForm from "@/components/seoCheckForm";
import Image from "next/image";
import AdvancedKeywordForm from "@/components/advancedKeywordForm";
import LLMForm from "@/components/LLMForm";
import ContentPlanningForm from "@/components/contentPlanningForm";
import FAQAccordion from "@/components/FAQAccordion";
import CodeBlock from "@/components/CodeBlock";

export const replaceComponents = (htmlContent) => {
  return parse(htmlContent, {
    replace: ({ attribs, name, children }) => {
      if (name === "div" && attribs && attribs.id === "seo-page-analyzer") {
        return <SeoCheckForm />;
      }
      if (name === "img" && attribs) {
        const { src, alt, width, height } = attribs;
        return <Image src={src} alt={alt} width={width} height={height} />;
      }
      if (
        name === "div" &&
        attribs &&
        attribs.id === "advanced-keyword-analysis"
      ) {
        return <AdvancedKeywordForm />;
      }
      if (name === "div" && attribs && attribs.id === "llm-txt-generator") {
        return <LLMForm />;
      }
      if (name === "div" && attribs && attribs.id === "content-planning") {
        return <ContentPlanningForm />;
      }
      // new FAQ replacement:
      if (name === "div" && attribs?.id === "faq-tsh") {
        // 1. extract title & description nodes
        let title = null;
        let description = null;
        const listWrapper = children.find(
          (c) =>
            c.type === "tag" &&
            c.name === "div" &&
            c.attribs?.class === "faq-block"
        );

        for (const child of children) {
          if (
            child.type === "tag" &&
            child.name === "h2" &&
            child.attribs?.class === "faq-block-title"
          ) {
            title = domToReact(child.children);
          }
          if (
            child.type === "tag" &&
            child.name === "p" &&
            child.attribs?.class === "faq-block-desc"
          ) {
            description = domToReact(child.children);
          }
        }

        // 2. build items array
        const items = (listWrapper?.children || [])
          .filter(
            (c) =>
              c.type === "tag" &&
              c.name === "div" &&
              c.attribs?.class === "faq-item"
          )
          .map((item) => {
            const qNode = item.children.find(
              (c) =>
                c.type === "tag" &&
                c.name === "h3" &&
                c.attribs?.class === "faq-q"
            );
            const aNode = item.children.find(
              (c) =>
                c.type === "tag" &&
                c.name === "div" &&
                c.attribs?.class === "faq-a"
            );
            return {
              question: qNode ? domToReact(qNode.children) : "",
              answer: aNode ? domToReact(aNode.children) : "",
            };
          });

        // 3. return your FAQAccordion in place of the original div
        return (
          <FAQAccordion title={title} description={description} items={items} />
        );
      }
      if (
        name === "div" &&
        attribs?.class?.includes("wp-block-kevinbatdorf-code-block-pro")
      ) {
        // 1) Grab the <span data-code="..."> node
        const codeSpan = children.find(
          (c) => c.type === "tag" && c.attribs?.["data-code"] !== undefined
        );

        let codeText = codeSpan ? codeSpan.attribs?.["data-code"] : "";

        // 1b) fallback: look *anywhere* inside for the first <textarea>
        if (!codeText) {
          const textareaNode = findFirstTextarea(children);
          if (textareaNode && textareaNode.children) {
            codeText = textareaNode.children
              .filter((n) => n.type === "text")
              .map((n) => n.data)
              .join("");
          }
        }

        // 2) Grab the language badge: first <span> → inner <span> text
        const langBadge = children
          .filter((c) => c.type === "tag")
          .map((c) =>
            c.children.find(
              (inner) =>
                inner.type === "tag" &&
                inner.children.length &&
                inner.children[0].type === "text"
            )
          )
          .find(Boolean);

        const language = langBadge
          ? langBadge.children[0].data.trim().toLowerCase()
          : "text";

        // 3) Return the SyntaxHighlighter
        return (
          <CodeBlock
            language={language === "Plaintext" ? "text" : language}
            code={codeText}
          />
        );
      }
    },
  });
};
function findFirstTextarea(nodes) {
  for (const n of nodes) {
    if (n.type === "tag" && n.name === "textarea") {
      return n;
    }
    if (n.children) {
      const found = findFirstTextarea(n.children);
      if (found) return found;
    }
  }
  return null;
}
