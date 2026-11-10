import { DEFAULT_CJK_CHARACTERS_PER_MINUTE, DEFAULT_WORDS_PER_MINUTE } from '../constants';
import type { WordCountResult } from '../types';

export interface CalculatorOptions {
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
}

export interface CalculatedReadingTime {
  minutes: number;
  roundedMinutes: number;
  time: number;
  words: number;
  characters: number;
}

/**
 * Calculates reading time in minutes and milliseconds from word count analysis.
 *
 * @param wordCount Word count analysis result.
 * @param options Reading speed options.
 * @returns Calculated reading time metrics.
 */
export function calculateReadingTime(
  wordCount: WordCountResult,
  options?: CalculatorOptions
): CalculatedReadingTime {
  const wordsPerMinute = options?.wordsPerMinute ?? DEFAULT_WORDS_PER_MINUTE;
  const cjkCharactersPerMinute = options?.cjkCharactersPerMinute ?? DEFAULT_CJK_CHARACTERS_PER_MINUTE;

  if (wordsPerMinute <= 0) {
    throw new RangeError('wordsPerMinute must be greater than 0');
  }

  if (cjkCharactersPerMinute <= 0) {
    throw new RangeError('cjkCharactersPerMinute must be greater than 0');
  }

  const { words, characters, latinWords, cjkCharacters } = wordCount;

  if (words === 0) {
    return {
      minutes: 0,
      roundedMinutes: 0,
      time: 0,
      words: 0,
      characters,
    };
  }

  const latinMinutes = latinWords / wordsPerMinute;
  const cjkMinutes = cjkCharacters / cjkCharactersPerMinute;
  const totalMinutes = latinMinutes + cjkMinutes;

  // Convert to milliseconds and round to nearest integer
  const time = Math.round(totalMinutes * 60 * 1000);

  // Accurate to 2 decimal places (e.g. 2.45)
  const minutes = Math.round(totalMinutes * 100) / 100;

  // Ceiling to next whole minute, minimum 1 if there are words
  const roundedMinutes = Math.max(1, Math.ceil(totalMinutes));

  return {
    minutes,
    roundedMinutes,
    time,
    words,
    characters,
  };
}
