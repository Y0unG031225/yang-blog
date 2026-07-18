import type { ReactNode } from "react";

export type MarkdownHeading = { id: string; text: string; level: 2 | 3 };

function plainText(value: string) {
  return value.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`~]/g, "");
}

function createSlugger() {
  const used = new Map<string, number>();
  return (text: string) => {
    const base = plainText(text).trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };
}

export function getMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const slug = createSlugger();
  return markdown.split(/\r?\n/).flatMap(line => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) return [];
    return [{ id: slug(match[2]), text: plainText(match[2]), level: match[1].length as 2 | 3 }];
  });
}

function safeHref(value: string) {
  return /^(https?:\/\/|mailto:|\/|#)/.test(value) ? value : "#";
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /(!?\[[^\]]*\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const result: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = tokenPattern.exec(text))) {
    if (match.index > cursor) result.push(text.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const image = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) result.push(<img key={key} src={safeHref(image[2])} alt={image[1]} loading="lazy"/>);
    else if (link) result.push(<a key={key} href={safeHref(link[2])}>{link[1]}</a>);
    else if (token.startsWith("**")) result.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    else if (token.startsWith("`")) result.push(<code key={key}>{token.slice(1, -1)}</code>);
    else result.push(<em key={key}>{token.slice(1, -1)}</em>);
    cursor = match.index + token.length;
  }
  if (cursor < text.length) result.push(text.slice(cursor));
  return result;
}

function isBlockStart(lines: string[], index: number) {
  const line = lines[index] ?? "";
  return !line.trim() || /^#{1,6}\s/.test(line) || /^```/.test(line) || /^>\s?/.test(line) || /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line) || /^---+$/.test(line) || /^!\[[^\]]*\]\([^)]+\)$/.test(line.trim()) || (line.includes("|") && /^\s*\|?\s*:?-+/.test(lines[index + 1] ?? ""));
}

export function MarkdownContent({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  const slug = createSlugger();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }

    const codeFence = line.match(/^```([^\s]*)/);
    if (codeFence) {
      const code: string[] = [];
      index++;
      while (index < lines.length && !/^```/.test(lines[index])) code.push(lines[index++]);
      index++;
      nodes.push(<pre key={`code-${index}`}><code data-language={codeFence[1] || undefined}>{code.join("\n")}</code></pre>);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const id = slug(heading[2]);
      if (level === 2) nodes.push(<h2 id={id} key={`h-${index}`}>{renderInline(heading[2], `h-${index}`)}</h2>);
      else if (level === 3) nodes.push(<h3 id={id} key={`h-${index}`}>{renderInline(heading[2], `h-${index}`)}</h3>);
      else nodes.push(<h4 id={id} key={`h-${index}`}>{renderInline(heading[2], `h-${index}`)}</h4>);
      index++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ""));
      nodes.push(<blockquote key={`quote-${index}`}>{renderInline(quote.join(" "), `quote-${index}`)}</blockquote>);
      continue;
    }

    const unordered = line.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      const items: string[] = [];
      while (index < lines.length) { const item = lines[index].match(/^[-*+]\s+(.+)$/); if (!item) break; items.push(item[1]); index++; }
      nodes.push(<ul key={`ul-${index}`}>{items.map((item, i) => <li key={i}>{renderInline(item, `ul-${index}-${i}`)}</li>)}</ul>);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      const items: string[] = [];
      while (index < lines.length) { const item = lines[index].match(/^\d+\.\s+(.+)$/); if (!item) break; items.push(item[1]); index++; }
      nodes.push(<ol key={`ol-${index}`}>{items.map((item, i) => <li key={i}>{renderInline(item, `ol-${index}-${i}`)}</li>)}</ol>);
      continue;
    }

    if (line.includes("|") && /^\s*\|?\s*:?-+/.test(lines[index + 1] ?? "")) {
      const cells = (row: string) => row.replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
      const headers = cells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(cells(lines[index++]));
      nodes.push(<table key={`table-${index}`}><thead><tr>{headers.map((cell, i) => <th key={i}>{renderInline(cell, `th-${index}-${i}`)}</th>)}</tr></thead><tbody>{rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{renderInline(cell, `td-${index}-${r}-${c}`)}</td>)}</tr>)}</tbody></table>);
      continue;
    }

    if (/^---+$/.test(line)) { nodes.push(<hr key={`hr-${index}`}/>); index++; continue; }

    const image = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) { nodes.push(<img className="article-image" key={`img-${index}`} src={safeHref(image[2])} alt={image[1]} loading="lazy"/>); index++; continue; }

    const paragraph: string[] = [line.trim()];
    index++;
    while (index < lines.length && !isBlockStart(lines, index)) paragraph.push(lines[index++].trim());
    nodes.push(<p key={`p-${index}`}>{renderInline(paragraph.join(" "), `p-${index}`)}</p>);
  }

  return <>{nodes}</>;
}
