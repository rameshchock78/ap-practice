"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

function renderSegment(text: string, display: boolean): string {
  try {
    return katex.renderToString(text, {
      throwOnError: false,
      displayMode: display,
    });
  } catch {
    return text;
  }
}

/** Renders plain text with $...$ / $$...$$ KaTeX segments. */
export function KatexText({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  const parts: { html?: string; text?: string }[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    if (m[1] != null) parts.push({ html: renderSegment(m[1], true) });
    else if (m[2] != null) parts.push({ html: renderSegment(m[2], false) });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.html != null ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: p.html }} />
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </span>
  );
}
