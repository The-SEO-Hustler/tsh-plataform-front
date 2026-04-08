import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import slugify from "slugify";
// import pageContentStyle from "../components/PostContent/PostContent.module.css";
export const indexContent = (content, anchor = true) => {
  const list = [];
  const usedIds = new Map();
  const new_content = content
    ? unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(() => {
        return (tree) => {
          visit(tree, "element", function (node) {
            if (node.tagName === "h2" || node.tagName === "h3") {
              const title = getTitleFromNode(node);

              const baseId = slugify(title, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g,
              }).replace(/_/g, "");

              const nextCount = (usedIds.get(baseId) ?? 0) + 1;
              usedIds.set(baseId, nextCount);
              const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

              node.properties.id = id;
              if (anchor) {
                if (Array.isArray(node.properties.className)) {
                }
                // node.properties.className.push(pageContentStyle.header);
                // else node.properties.className = pageContentStyle.header;
              }
              list.push({
                id,
                title,
                tag: node.tagName,
              });

              // Ensure a single anchor element and keep it in sync with the heading id.
              const existingAnchorIdx = node.children.findIndex(
                (child) =>
                  child?.type === "element" &&
                  child?.tagName === "a" &&
                  (child?.properties?.className === "anchor-heading" ||
                    (Array.isArray(child?.properties?.className) &&
                      child.properties.className.includes("anchor-heading")))
              );

              const anchorNode = {
                type: "element",
                properties: {
                  href: `#${id}`,
                  "aria-label": title,
                  "aria-hidden": "true",
                  className: "anchor-heading",
                  tabindex: -1,
                },
                tagName: "a",
                children: [],
              };

              if (existingAnchorIdx >= 0) {
                node.children[existingAnchorIdx] = anchorNode;
              } else {
                node.children.unshift(anchorNode);
              }
            }
          });
          return;
        };
      })
      .use(rehypeStringify)
      .processSync(content)
      .toString()
    : null;

  return { new_content, list };
};

function getTitleFromNode(node) {
  const parts = [];

  const walk = (n) => {
    if (!n) return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (n.type === "text" && typeof n.value === "string") {
      parts.push(n.value);
      return;
    }
    if (n.type === "element") {
      // Skip existing anchor links inside headings
      const cls = n.properties?.className;
      const hasAnchorHeadingClass =
        cls === "anchor-heading" ||
        (Array.isArray(cls) && cls.includes("anchor-heading"));
      if (n.tagName === "a" && hasAnchorHeadingClass) return;

      if (n.tagName === "img") {
        parts.push(n.properties?.alt || "");
        return;
      }
      if (n.children) walk(n.children);
    }
  };

  walk(node.children);

  return parts.join("").replace(/\s+/g, " ").trim();
}
