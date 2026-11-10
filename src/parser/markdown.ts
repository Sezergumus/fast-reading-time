/**
 * Strips Markdown syntax from a text string, preserving prose content while removing
 * formatting artifacts like code blocks, headings, images, link syntax, tables, and blockquotes.
 *
 * @param markdown The raw Markdown string.
 * @returns Cleaned prose text.
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  let text = markdown;

  // 1. Remove YAML / TOML frontmatter (at start of text)
  text = text.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---/m, '');
  text = text.replace(/^\+\+\+[\r\n]+[\s\S]*?[\r\n]+\+\+\+/m, '');

  // 2. Remove fenced code blocks (both ``` and ~~~)
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/~~~[\s\S]*?~~~/g, ' ');

  // 3. Remove display math blocks ($$...$$)
  text = text.replace(/\$\$[\s\S]*?\$\$/g, ' ');

  // 4. Remove image syntax (![alt](url "title") and ![alt][ref])
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  text = text.replace(/!\[[^\]]*\]\[[^\]]*\]/g, ' ');

  // 5. Replace link syntax with link text: [anchor](url "title") -> anchor
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1');

  // 6. Remove reference-style link definitions: [ref]: http://example.com "title"
  text = text.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, ' ');

  // 7. Remove footnote references and definitions: [^1] or [^1]: note
  text = text.replace(/^\s*\[\^[^\]]+\]:.*$/gm, ' ');
  text = text.replace(/\[\^[^\]]+\]/g, ' ');

  // 8. Remove table separator rows (| --- | :---: | ---: |)
  text = text.replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/gm, ' ');

  // 9. Remove table pipes (|)
  text = text.replace(/\|/g, ' ');

  // 10. Remove ATX headings (# Heading)
  text = text.replace(/^#{1,6}\s+/gm, ' ');

  // 11. Remove setext/underlined headings (=== or ---)
  text = text.replace(/^[=-]{2,}\s*$/gm, ' ');

  // 12. Remove blockquote markers (> Quote)
  text = text.replace(/^\s*>\s*/gm, ' ');

  // 13. Remove horizontal rules (---, ***, ___)
  text = text.replace(/^\s*([*\-_])(?:\s*\1){2,}\s*$/gm, ' ');

  // 14. Remove list bullet and number markers (including task lists [x] or [ ])
  text = text.replace(/^\s*[-*+]\s+(?:\[[ xX]\]\s*)?/gm, ' ');
  text = text.replace(/^\s*\d+\.\s+(?:\[[ xX]\]\s*)?/gm, ' ');

  // 15. Remove inline code backticks: `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1');

  // 16. Remove inline math ($x$)
  text = text.replace(/\$([^$\n]+)\$/g, '$1');

  // 17. Remove bold, italic, and strikethrough markers
  // Bold & Italic (***text*** or ___text___)
  text = text.replace(/(\*{3}|_{3})(.*?)\1/g, '$2');
  // Bold (**text** or __text__)
  text = text.replace(/(\*{2}|_{2})(.*?)\1/g, '$2');
  // Italic (*text* or _text_)
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  // Strikethrough (~~text~~)
  text = text.replace(/~~(.*?)~~/g, '$1');

  // 18. Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}
