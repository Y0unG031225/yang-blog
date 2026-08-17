import type { ReactNode } from "react";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type MarkdownHeading = { id: string; text: string; level: 1 | 2 | 3 };

type TreeNode = {
  type?: string;
  depth?: number;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: TreeNode[];
};

function visit(node: TreeNode, callback: (node: TreeNode) => void) {
  callback(node);
  node.children?.forEach((child) => visit(child, callback));
}

function withBasePath(value: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return basePath && value.startsWith("/") && !value.startsWith("//")
    ? `${basePath}${value}`
    : value;
}

function normalizeMarkdownElements() {
  return (tree: TreeNode) => {
    const contentSlugger = new GithubSlugger();
    visit(tree, (node) => {
      if (node.type !== "element") return;

      if (node.tagName === "h1") {
        node.tagName = "h2";
        node.properties = {
          ...node.properties,
          id: `content-${contentSlugger.slug(toString(node as never))}`,
        };
      }

      if (node.tagName === "img") {
        const source =
          typeof node.properties?.src === "string" ? node.properties.src : "";
        node.properties = {
          ...node.properties,
          src: withBasePath(source),
          className: ["article-image"],
          loading: "lazy",
          decoding: "async",
        };
      }

      if (node.tagName === "a") {
        const href =
          typeof node.properties?.href === "string" ? node.properties.href : "";
        node.properties = { ...node.properties, href: withBasePath(href) };
      }
    });
  };
}

const sanitizeSchema = {
  ...defaultSchema,
  clobberPrefix: "",
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className", /^language-./, "math-inline"],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ["className", "math", "math-display"],
    ],
    ul: [
      ...(defaultSchema.attributes?.ul ?? []),
      ["className", "contains-task-list"],
    ],
    li: [
      ...(defaultSchema.attributes?.li ?? []),
      ["className", "task-list-item"],
    ],
    input: [
      ...(defaultSchema.attributes?.input ?? []),
      ["type", "checkbox"],
      "checked",
      "disabled",
    ],
    section: [
      ...(defaultSchema.attributes?.section ?? []),
      "dataFootnotes",
      ["className", "footnotes"],
    ],
    h2: [...(defaultSchema.attributes?.h2 ?? []), ["className", "sr-only"]],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      "dataFootnoteRef",
      "dataFootnoteBackref",
      "ariaDescribedBy",
      "ariaLabel",
      ["className", "data-footnote-backref"],
    ],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ["className", "math", "math-inline"],
    ],
  },
};

const markdownParser = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath);

const markdownRenderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSanitize, sanitizeSchema)
  .use(normalizeMarkdownElements)
  .use(rehypeSlug)
  .use(rehypeKatex, {
    throwOnError: false,
    strict: "warn",
    trust: false,
    output: "htmlAndMathml",
  })
  .use(rehypeHighlight, { detect: false, ignoreMissing: true })
  .use(rehypeReact, { Fragment, jsx, jsxs });

export function getMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const tree = markdownParser.parse(markdown) as TreeNode;
  const slugger = new GithubSlugger();
  const contentSlugger = new GithubSlugger();
  const headings: MarkdownHeading[] = [];

  visit(tree, (node) => {
    if (node.type !== "heading" || !node.depth || node.depth > 4) return;
    const text = toString(node as never);
    const id =
      node.depth === 1
        ? `content-${contentSlugger.slug(text)}`
        : slugger.slug(text);
    const level = Math.max(1, node.depth - 1) as 1 | 2 | 3;
    headings.push({ id, text, level });
  });

  return headings;
}

export function MarkdownContent({ markdown }: { markdown: string }) {
  return markdownRenderer.processSync(markdown).result as ReactNode;
}
