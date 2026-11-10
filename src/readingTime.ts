import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from './constants';
import { calculateReadingTime } from './core/calculator';
import { countWords } from './core/wordCounter';
import { formatReadingTime } from './i18n/formatter';
import { cleanContent } from './parser';
import type { RawReadingTime, ReadingTimeOptions, ReadingTimeResult } from './types';

/**
 * Calculates estimated reading time for a given text string.
 * Strips Markdown syntax and HTML tags by default, accurately counts
 * Unicode words and CJK characters, and returns humanized localized reading time.
 *
 * @param text The input text, Markdown, or HTML string to analyze.
 * @param options Optional configuration for reading speed, language, format, and stripping.
 * @returns ReadingTimeResult containing formatted text, minutes, milliseconds, and word count.
 *
 * @example
 * ```ts
 * import { readingTime } from 'reading-time-estimator';
 *
 * const result = readingTime('This is a short post.');
 * console.log(result.text); // "< 1 min read"
 * console.log(result.words); // 5
 * console.log(result.time);  // 1500 (ms)
 * ```
 */
export function readingTime(
  text: string,
  options?: ReadingTimeOptions
): ReadingTimeResult {
  // 1. Clean content (strip Markdown and/or HTML if enabled)
  const cleanedText = cleanContent(text, {
    stripMarkdown: options?.stripMarkdown,
    stripHtml: options?.stripHtml,
  });

  // 2. Count words, CJK characters, and total characters
  const wordCount = countWords(cleanedText, {
    wordPattern: options?.wordPattern,
  });

  // 3. Compute reading time in minutes and milliseconds
  const calculated = calculateReadingTime(wordCount, {
    wordsPerMinute: options?.wordsPerMinute,
    cjkCharactersPerMinute: options?.cjkCharactersPerMinute,
  });

  // 4. Prepare raw result for formatter
  const language = options?.language ?? DEFAULT_LANGUAGE;
  const format = options?.format ?? DEFAULT_FORMAT;

  const raw: RawReadingTime = {
    ...calculated,
    language,
    format,
  };

  // 5. Generate formatted string representation
  const formattedText = formatReadingTime(raw, {
    language,
    format,
    customFormatter: options?.customFormatter,
  });

  return {
    text: formattedText,
    minutes: calculated.minutes,
    roundedMinutes: calculated.roundedMinutes,
    time: calculated.time,
    words: calculated.words,
    characters: calculated.characters,
  };
}

export default readingTime;
