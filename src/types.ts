/**
 * Options and result types for reading-time-estimator.
 */

export type OutputFormat = 'human' | 'compact' | 'raw';

export interface ReadingTimeOptions {
  /**
   * Reading speed in words per minute for standard/spaced text.
   * @default 200
   */
  wordsPerMinute?: number;

  /**
   * Reading speed in characters per minute for CJK (Chinese, Japanese, Korean) text.
   * @default 400
   */
  cjkCharactersPerMinute?: number;

  /**
   * Language code for humanized text output (e.g. 'en', 'tr', 'es', 'fr', 'de', 'it', 'zh', 'ja', 'pt', 'ru').
   * @default 'en'
   */
  language?: string;

  /**
   * Output formatting style:
   * - `'human'`: e.g. "2 min read", "< 1 min read", "2 dk okuma"
   * - `'compact'`: e.g. "2m", "< 1m", "2dk"
   * - `'raw'`: e.g. "2", "0"
   * @default 'human'
   */
  format?: OutputFormat;

  /**
   * Custom formatting callback to produce the formatted text.
   */
  customFormatter?: (result: RawReadingTime) => string;

  /**
   * Whether to strip Markdown syntax (code blocks, headings, images, links, blockquotes) before counting words.
   * @default true
   */
  stripMarkdown?: boolean;

  /**
   * Whether to strip HTML tags, comments, and decode HTML entities before counting words.
   * @default true
   */
  stripHtml?: boolean;

  /**
   * Custom regular expression to match words in non-CJK text.
   * Default matches Unicode letters and numbers with contraction apostrophes/hyphens.
   */
  wordPattern?: RegExp;
}

export interface ReadingTimeResult {
  /**
   * Formatted humanized text representation (e.g. "2 min read", "< 1 min read", "2 dk okuma").
   */
  text: string;

  /**
   * Estimated reading time in minutes, rounded to two decimal places (e.g. 2.45, 1, 0.5).
   */
  minutes: number;

  /**
   * Reading time rounded up to the nearest whole minute (e.g. 3, 1, 0).
   */
  roundedMinutes: number;

  /**
   * Estimated reading time in milliseconds.
   */
  time: number;

  /**
   * Total word count (space-separated words + CJK character equivalents).
   */
  words: number;

  /**
   * Total character count.
   */
  characters: number;
}

export interface RawReadingTime {
  minutes: number;
  roundedMinutes: number;
  time: number;
  words: number;
  characters: number;
  language: string;
  format?: OutputFormat;
}

export interface WordCountResult {
  /**
   * Total effective words (latinWords + cjkCharacters).
   */
  words: number;

  /**
   * Total character count.
   */
  characters: number;

  /**
   * Space-separated / non-CJK word count.
   */
  latinWords: number;

  /**
   * Number of CJK characters found.
   */
  cjkCharacters: number;
}

export interface LocalePattern {
  lessThanOne: string;
  one: string;
  other: string;
}

export interface LocaleDefinition {
  human: LocalePattern;
  compact: LocalePattern;
}
