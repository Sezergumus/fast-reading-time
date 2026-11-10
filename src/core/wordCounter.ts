import { CJK_REGEX, DEFAULT_WORD_PATTERN } from '../constants';
import type { WordCountResult } from '../types';

export interface CountWordsOptions {
  /**
   * Custom regular expression to match words in non-CJK text.
   */
  wordPattern?: RegExp;
}

/**
 * Counts words and characters in a given text string, supporting Unicode and CJK characters.
 *
 * @param text The input text string to analyze.
 * @param options Optional word counting options.
 * @returns WordCountResult with total words, characters, latin words, and CJK character count.
 */
export function countWords(text: string, options?: CountWordsOptions): WordCountResult {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      characters: 0,
      latinWords: 0,
      cjkCharacters: 0,
    };
  }

  // Count Unicode code points (properly handling surrogate pairs and emojis)
  const characters = Array.from(text).length;

  // Extract CJK characters
  const cjkRegex = new RegExp(CJK_REGEX.source, CJK_REGEX.flags);
  const cjkMatches = text.match(cjkRegex);
  const cjkCharacters = cjkMatches ? cjkMatches.length : 0;

  // Extract non-CJK words by replacing CJK characters with spaces
  const nonCjkText = text.replace(cjkRegex, ' ');
  const wordRegex = options?.wordPattern
    ? new RegExp(options.wordPattern.source, options.wordPattern.flags)
    : new RegExp(DEFAULT_WORD_PATTERN.source, DEFAULT_WORD_PATTERN.flags);

  const latinMatches = nonCjkText.match(wordRegex);
  const latinWords = latinMatches ? latinMatches.length : 0;

  const words = latinWords + cjkCharacters;

  return {
    words,
    characters,
    latinWords,
    cjkCharacters,
  };
}
