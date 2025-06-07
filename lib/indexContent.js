import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
// import pageContentStyle from "../components/PostContent/PostContent.module.css";
export const indexContent = (content, anchor = true) => {
  const list = [];
  const new_content = content
    ? unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(() => {
        return (tree) => {
          visit(tree, "element", function (node) {
            if (node.tagName === "h2" || node.tagName === "h3") {
              let title = getTitleFromNode(node);

              const id = title.replaceAll(" ", "-").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '').replaceAll(".", "").replaceAll(",", "").replaceAll("!", "").replaceAll("?", "").replaceAll("(", "").replaceAll(")", "").replaceAll("'", "").replaceAll(":", "").replaceAll('"', '');
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

              node.children.unshift({
                type: "element",
                properties: {
                  href: `#${id}`,
                  // class: anchor && pageContentStyle.anchor,
                  "aria-label": id,
                  "aria-hidden": "true",
                  className: "anchor-heading",
                  tabindex: -1,
                },
                tagName: "a",
              });
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
  if (node?.children[0]?.type === "text") {
    return node.children[0].value;
  } else if (node?.children[0]?.tagName === "img") {
    // If the first child is an image, use its alt text as the title
    return node.children[0].properties.alt || "";
  } else if (node?.children[0]?.children) {
    // Iterate over children to find text content
    let title = "";
    node.children[0].children.forEach((child) => {
      if (child.type === "text") {
        title += child.value;
      }
    });
    return title;
  }
  return "";
}
