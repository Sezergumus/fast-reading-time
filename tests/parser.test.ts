import { describe, expect, it } from 'vitest';
import {
  cleanContent,
  decodeHtmlEntities,
  stripHtml,
  stripMarkdown,
} from '../src';

describe('Markdown Stripper', () => {
  it('handles empty and null values', () => {
    expect(stripMarkdown('')).toBe('');
    // @ts-expect-error testing runtime safety
    expect(stripMarkdown(null)).toBe('');
    // @ts-expect-error testing runtime safety
    expect(stripMarkdown(undefined)).toBe('');
  });

  it('strips YAML and TOML frontmatter', () => {
    const markdown = `---
title: "My Blog Post"
author: "Sezer Gümüş"
date: 2026-01-01
tags: ["node", "typescript"]
---

# Real Heading
This is the actual article content.`;

    const cleaned = stripMarkdown(markdown);
    expect(cleaned).not.toContain('title');
    expect(cleaned).not.toContain('Sezer Gümüş');
    expect(cleaned).toContain('Real Heading');
    expect(cleaned).toContain('This is the actual article content.');
  });

  it('strips fenced code blocks (backticks and tildes)', () => {
    const markdown = `Before code.

\`\`\`typescript
interface User {
  id: string;
  name: string;
}
function greet(user: User) {
  console.log("Hello, " + user.name);
}
\`\`\`

Middle text.

~~~bash
npm install reading-time-estimator
git commit -m "feat: parser"
~~~

After code.`;

    const cleaned = stripMarkdown(markdown);
    expect(cleaned).not.toContain('interface User');
    expect(cleaned).not.toContain('npm install');
    expect(cleaned).toBe('Before code. Middle text. After code.');
  });

  it('strips images but preserves links anchor text', () => {
    const markdown = `Check out this ![Cool Logo](https://example.com/logo.png "Logo") and visit [Google](https://google.com "Search").`;
    const cleaned = stripMarkdown(markdown);

    expect(cleaned).not.toContain('Cool Logo');
    expect(cleaned).not.toContain('https://example.com/logo.png');
    expect(cleaned).toContain('Google');
    expect(cleaned).not.toContain('https://google.com');
  });

  it('strips reference-style links and definitions', () => {
    const markdown = `Here is a [link][ref-1] to a reference.

[ref-1]: https://example.com/reference "Reference Title"`;

    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toContain('Here is a link to a reference.');
    expect(cleaned).not.toContain('https://example.com/reference');
  });

  it('strips headings markers (#)', () => {
    const markdown = `# Heading 1\n## Heading 2\n### Heading 3\nContent under heading.`;
    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toBe('Heading 1 Heading 2 Heading 3 Content under heading.');
  });

  it('strips setext/underlined headings', () => {
    const markdown = `Main Heading\n============\n\nSub Heading\n-----------\nParagraph.`;
    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toBe('Main Heading Sub Heading Paragraph.');
  });

  it('strips blockquotes and horizontal rules', () => {
    const markdown = `> This is a famous quote.\n> Second line of quote.\n\n---\n\nRegular paragraph.\n***\nAnother paragraph.`;
    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toContain('This is a famous quote.');
    expect(cleaned).not.toContain('>');
    expect(cleaned).not.toContain('---');
    expect(cleaned).not.toContain('***');
  });

  it('strips list bullets, numbers, and task checkboxes', () => {
    const markdown = `- Item 1
* Item 2
+ Item 3
- [ ] Incomplete task
- [x] Completed task
1. Step one
2. Step two`;

    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toBe('Item 1 Item 2 Item 3 Incomplete task Completed task Step one Step two');
  });

  it('strips markdown tables while preserving cell contents', () => {
    const markdown = `| Header 1 | Header 2 |
| :------- | -------: |
| Value A  | Value B  |
| Value C  | Value D  |`;

    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toBe('Header 1 Header 2 Value A Value B Value C Value D');
    expect(cleaned).not.toContain('|');
    expect(cleaned).not.toContain('---');
  });

  it('strips formatting markers (bold, italic, strikethrough, inline code)', () => {
    const markdown = `**Bold text**, *italic text*, ***bold italic***, ~~strikethrough~~, and \`inline code\`.`;
    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toBe('Bold text, italic text, bold italic, strikethrough, and inline code.');
  });

  it('strips footnote references and definitions', () => {
    const markdown = `Text with a footnote[^1].\n\n[^1]: This is the footnote text.`;
    const cleaned = stripMarkdown(markdown);
    expect(cleaned).toContain('Text with a footnote');
    expect(cleaned).not.toContain('[^1]');
  });
});

describe('HTML Stripper & Entity Decoder', () => {
  it('handles empty and null values', () => {
    expect(stripHtml('')).toBe('');
    // @ts-expect-error testing runtime safety
    expect(stripHtml(null)).toBe('');
  });

  it('strips script, style, and svg blocks along with contents', () => {
    const html = `<div>
      <p>Visible paragraph</p>
      <script>var x = 100; alert('hacked');</script>
      <style>.hidden { display: none; }</style>
      <svg><circle cx="50" cy="50" r="40"/></svg>
      <span>Another visible span</span>
    </div>`;

    const cleaned = stripHtml(html);
    expect(cleaned).not.toContain('alert');
    expect(cleaned).not.toContain('display: none');
    expect(cleaned).not.toContain('circle');
    expect(cleaned).toBe('Visible paragraph Another visible span');
  });

  it('strips HTML comments, DOCTYPE, and XML tags', () => {
    const html = `<!DOCTYPE html>
<!-- This is a secret comment -->
<?xml version="1.0" encoding="UTF-8"?>
<p>Hello world</p>`;

    const cleaned = stripHtml(html);
    expect(cleaned).toBe('Hello world');
  });

  it('properly places space between block tags', () => {
    const html = '<p>First paragraph</p><p>Second paragraph</p>';
    const cleaned = stripHtml(html);
    expect(cleaned).toBe('First paragraph Second paragraph');
  });

  it('decodes named entities', () => {
    expect(decodeHtmlEntities('Hello&nbsp;World')).toBe('Hello World');
    expect(decodeHtmlEntities('Tom &amp; Jerry')).toBe('Tom & Jerry');
    expect(decodeHtmlEntities('&lt;div&gt; &quot;quote&quot; &apos;single&apos;')).toBe('<div> "quote" \'single\'');
    expect(decodeHtmlEntities('&copy; 2026 &mdash; All rights reserved &hellip;')).toBe('© 2026 — All rights reserved …');
  });

  it('decodes decimal numeric entities', () => {
    expect(decodeHtmlEntities('&#169; 2026')).toBe('© 2026');
    expect(decodeHtmlEntities('&#8212; dash')).toBe('— dash');
    expect(decodeHtmlEntities('&#99999999; invalid')).toBe(' invalid');
  });

  it('decodes hexadecimal numeric entities', () => {
    expect(decodeHtmlEntities('&#x00A9; 2026')).toBe('© 2026');
    expect(decodeHtmlEntities('&#x2014; dash')).toBe('— dash');
    expect(decodeHtmlEntities('&#x110000; invalid')).toBe(' invalid');
  });
});

describe('cleanContent combined pipeline', () => {
  it('strips both markdown and embedded HTML', () => {
    const mixed = `# Title

This is a blog post with <span class="highlight">inline HTML</span> and a [link](https://example.com).

\`\`\`js
console.log('secret code');
\`\`\`

<!-- Hidden note -->
<p>Closing paragraph with &amp; entity.</p>`;

    const cleaned = cleanContent(mixed);
    expect(cleaned).toBe('Title This is a blog post with inline HTML and a link. Closing paragraph with & entity.');
  });
});
