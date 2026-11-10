import type { OutputFormat } from './types';

export const DEFAULT_WORDS_PER_MINUTE = 200;
export const DEFAULT_CJK_CHARACTERS_PER_MINUTE = 400;
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_FORMAT: OutputFormat = 'human';

/**
 * Regex matching CJK characters:
 * - CJK Unified Ideographs: \u4e00-\u9fff
 * - CJK Compatibility Ideographs: \uf900-\ufaff
 * - Hiragana: \u3040-\u309f
 * - Katakana: \u30a0-\u30ff
 * - Hangul Syllables: \uac00-\ud7af
 * - Hangul Jamo: \u1100-\u11ff, \u3130-\u318f
 */
export const CJK_REGEX = /[\u4e00-\u9fff\uf900-\ufaff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/gu;

/**
 * Default word pattern matching Unicode words, numbers, and common contraction apostrophes/hyphens.
 */
export const DEFAULT_WORD_PATTERN = /[\p{L}\p{N}\p{M}]+(?:['’_-][\p{L}\p{N}\p{M}]+)*/gu;
