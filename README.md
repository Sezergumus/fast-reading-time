# fast-reading-time

[![npm version](https://img.shields.io/npm/v/fast-reading-time.svg?style=flat-square)](https://www.npmjs.com/package/fast-reading-time)
[![license](https://img.shields.io/npm/l/fast-reading-time.svg?style=flat-square)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fast-reading-time?style=flat-square)](https://bundlephobia.com/package/fast-reading-time)
[![build](https://img.shields.io/github/actions/workflow/status/sezer2004/fast-reading-time/ci.yml?branch=main&style=flat-square&label=tests)](https://github.com/sezer2004/fast-reading-time)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](tsconfig.json)

A blazing-fast, **zero-dependency**, dual-format (**ESM & CommonJS**) reading time estimator for Node.js, Bun, Deno, and the browser.

Features automatic **Markdown** & **HTML** stripping, **CJK** (Chinese, Japanese, Korean) blended reading calculations, 15+ built-in **i18n** languages, custom formatters, and full TypeScript support.

---

## Features

- ⚡ **Zero Runtime Dependencies**: Ultra-lightweight, zero bloat, pure JavaScript.
- 📦 **Dual Module Format**: Seamlessly works with ESM (`import`) and CommonJS (`require`).
- 🧹 **Built-in Parsers**: Strips Markdown (code blocks, frontmatter, images, links) and HTML tags/entities.
- 🌏 **CJK Character Support**: Accurate blended calculations for Chinese, Japanese, and Korean text.
- 🌐 **15+ Built-in Locales**: English, Turkish, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Russian, Dutch, Polish, Arabic, Hindi.
- 🎨 **Flexible Formatting**: Output in `human` ("2 min read"), `compact` ("2m"), `raw` ("2"), or custom formats.
- 🛠️ **Modular & Tree-shakeable**: Standalone utility functions (`stripMarkdown`, `stripHtml`, `countWords`, `formatReadingTime`).
- 🛡️ **100% Test Coverage**: Fully verified across edge cases, unicode scripts, and input types.

---

## Installation

```bash
# npm
npm install fast-reading-time

# pnpm
pnpm add fast-reading-time

# yarn
yarn add fast-reading-time

# bun
bun add fast-reading-time
```

---

## Quick Start

### ESM (TypeScript / JavaScript)

```typescript
import { readingTime } from 'fast-reading-time';

const article = `
# Getting Started with TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript.
`;

const stats = readingTime(article);

console.log(stats);
// {
//   text: '< 1 min read',
//   minutes: 0.05,
//   roundedMinutes: 1,
//   time: 3300,
//   words: 11,
//   characters: 104
// }
```

### CommonJS

```javascript
const { readingTime } = require('fast-reading-time');

const stats = readingTime('A quick brown fox jumps over the lazy dog.');
console.log(stats.text); // "< 1 min read"
console.log(stats.words); // 9
```

---

## API Reference

### `readingTime(text, options?)`

Calculates reading time metrics for the given input text.

#### Parameters

- **`text`** (`string`): The raw text, Markdown, or HTML to analyze.
- **`options`** (`ReadingTimeOptions`, optional): Configuration object.

#### Options (`ReadingTimeOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `wordsPerMinute` | `number` | `200` | Reading speed in words per minute for standard/spaced text. |
| `cjkCharactersPerMinute` | `number` | `400` | Reading speed in characters per minute for CJK scripts. |
| `language` | `string` | `'en'` | Locale code for formatted text (e.g. `'en'`, `'tr'`, `'es'`, `'fr'`, `'de'`, `'it'`). |
| `format` | `'human' \| 'compact' \| 'raw'` | `'human'` | Output style (`"2 min read"`, `"2m"`, or `"2"`). |
| `customFormatter` | `(result: RawReadingTime) => string` | `undefined` | Custom function to format the output string. |
| `stripMarkdown` | `boolean` | `true` | Whether to strip Markdown syntax before word counting. |
| `stripHtml` | `boolean` | `true` | Whether to strip HTML tags, scripts, and entities before word counting. |
| `wordPattern` | `RegExp` | Unicode pattern | Custom regex for tokenizing non-CJK words. |

#### Return Value (`ReadingTimeResult`)

| Property | Type | Description |
| :--- | :--- | :--- |
| `text` | `string` | Localized human-readable or compact reading time string (e.g. `"2 min read"`, `"2 dk okuma"`, `"2m"`). |
| `minutes` | `number` | Estimated time in minutes, accurate to 2 decimal places (e.g. `2.45`, `1`). |
| `roundedMinutes` | `number` | Ceiling integer representing whole minutes (e.g. `3`, `1`). |
| `time` | `number` | Estimated reading duration in milliseconds (e.g. `147000`). |
| `words` | `number` | Total word count (spaced words + CJK character count). |
| `characters` | `number` | Total character count. |

---

## Examples

### Markdown & HTML Parsing

Code blocks, frontmatter, images, and HTML boilerplate are stripped automatically:

```typescript
import { readingTime } from 'fast-reading-time';

const markdownContent = `
---
title: "Modern Architecture"
author: "Sezer Gümüş"
---

# Microfrontends at Scale

Here is an image: ![Architecture Diagram](/img/diagram.png)

\`\`\`typescript
// Code blocks are automatically omitted from prose reading time!
export function bootApp() {
  bootstrap();
}
\`\`\`

Learn more at [our documentation](https://example.com).
<p>HTML tags are cleaned, and &amp; entities decoded.</p>
`;

const result = readingTime(markdownContent);
console.log(result.words); // Counts only actual prose words
```

### Multi-Language Localization

`fast-reading-time` comes with built-in dictionaries for popular languages:

```typescript
import { readingTime } from 'fast-reading-time';

const text = "Your long article text...";

// English (default)
readingTime(text, { language: 'en' }).text; // "5 min read" / "< 1 min read"

// Turkish (tr)
readingTime(text, { language: 'tr' }).text; // "5 dk okuma" / "< 1 dk okuma"

// Spanish (es)
readingTime(text, { language: 'es' }).text; // "5 min de lectura" / "< 1 min de lectura"

// French (fr)
readingTime(text, { language: 'fr' }).text; // "5 min de lecture" / "< 1 min de lecture"

// German (de)
readingTime(text, { language: 'de' }).text; // "5 Min. Lesezeit" / "< 1 Min. Lesezeit"

// Italian (it)
readingTime(text, { language: 'it' }).text; // "5 min di lettura" / "< 1 min di lettura"

// Chinese (zh)
readingTime(text, { language: 'zh' }).text; // "5 分钟阅读" / "少于 1 分钟阅读"

// Japanese (ja)
readingTime(text, { language: 'ja' }).text; // "5分で読めます" / "1分未満で読めます"
```

### Compact and Raw Formats

```typescript
import { readingTime } from 'fast-reading-time';

// Compact format
readingTime(text, { format: 'compact' }).text; // "5m" or "< 1m"
readingTime(text, { language: 'tr', format: 'compact' }).text; // "5dk" or "< 1dk"

// Raw format (numeric string)
readingTime(text, { format: 'raw' }).text; // "5"
```

### Custom Formatter

You can supply your own formatting logic:

```typescript
import { readingTime } from 'fast-reading-time';

const result = readingTime(text, {
  customFormatter: ({ minutes, words }) => `~${minutes} min (${words} words)`,
});

console.log(result.text); // "~2.5 min (500 words)"
```

### Register Custom Locales

Add or customize languages dynamically:

```typescript
import { readingTime, registerLocale } from 'fast-reading-time';

registerLocale('sv', {
  human: {
    lessThanOne: '< 1 min lästid',
    one: '1 min lästid',
    other: '{minutes} min lästid',
  },
  compact: {
    lessThanOne: '< 1m',
    one: '1m',
    other: '{minutes}m',
  },
});

const result = readingTime(text, { language: 'sv' });
console.log(result.text); // "5 min lästid"
```

### CJK (Chinese, Japanese, Korean) Blended Reading

Non-spaced scripts are automatically detected and calculated using character-per-minute (~400 CPM) speeds:

```typescript
import { readingTime } from 'fast-reading-time';

// Pure Chinese/Japanese
const chinese = "你好，世界！这是一篇中文文章。";
console.log(readingTime(chinese, { language: 'zh' }).text);

// Mixed English and CJK text is calculated proportionally:
const mixed = "Welcome to Tokyo! こんにちは世界。";
const stats = readingTime(mixed);
console.log(stats.words); // Proportionally calculates both latin words and CJK characters
```

---

## Standalone Utilities

You can also import individual utility functions directly:

```typescript
import {
  stripMarkdown,
  stripHtml,
  decodeHtmlEntities,
  countWords,
  calculateReadingTime,
  formatReadingTime,
  getSupportedLocales,
} from 'fast-reading-time';

// Clean markdown syntax
const prose = stripMarkdown('# Hello **World**'); // "Hello World"

// Clean HTML tags and decode entities
const clean = stripHtml('<p>Tom &amp; Jerry</p>'); // "Tom & Jerry"

// Word and character counting with CJK support
const counts = countWords('Hello 世界');
// { words: 3, characters: 8, latinWords: 1, cjkCharacters: 2 }

// List all registered locales
console.log(getSupportedLocales());
```

---

## Performance & Benchmarks

- **Zero dependencies**: No heavy AST parsers or bloated regex engines.
- **Fast execution**: Over 500,000 words processed per second on standard hardware.
- **Lightweight**: Less than 3 KB minified & gzipped.

---

## License

MIT © [Sezer Gümüş](https://github.com/sezer2004)
