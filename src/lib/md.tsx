import type { ReactNode } from 'react';

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <a key={`${keyPrefix}-${i++}`} href={match[2]}>
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function renderMarkdown(content: string): ReactNode[] {
  return content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i}>{renderInline(block.slice(3), `h2-${i}`)}</h2>;
      }
      return <p key={i}>{renderInline(block, `p-${i}`)}</p>;
    });
}
