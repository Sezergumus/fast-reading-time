import { describe, expect, it } from 'vitest';
import { readingTime, default as defaultReadingTime } from '../src';

describe('readingTime', () => {
  it('should export both named and default readingTime function', () => {
    expect(readingTime).toBeDefined();
    expect(defaultReadingTime).toBe(readingTime);
  });

  describe('empty and edge case inputs', () => {
    it('handles empty string', () => {
      const result = readingTime('');
      expect(result).toEqual({
        text: '< 1 min read',
        minutes: 0,
        roundedMinutes: 0,
        time: 0,
        words: 0,
        characters: 0,
      });
    });

    it('handles whitespace-only string', () => {
      const result = readingTime('    \n\t   ');
      expect(result).toEqual({
        text: '< 1 min read',
        minutes: 0,
        roundedMinutes: 0,
        time: 0,
        words: 0,
        characters: 0,
      });
    });

    it('handles text with only punctuation', () => {
      const result = readingTime('... --- !!! ??? ,,, ;;; :::');
      expect(result.words).toBe(0);
      expect(result.text).toBe('< 1 min read');
      expect(result.time).toBe(0);
      expect(result.minutes).toBe(0);
    });

    it('handles null and undefined safely if passed', () => {
      // @ts-expect-error testing runtime safety
      const resultNull = readingTime(null);
      expect(resultNull.words).toBe(0);
      expect(resultNull.text).toBe('< 1 min read');

      // @ts-expect-error testing runtime safety
      const resultUndefined = readingTime(undefined);
      expect(resultUndefined.words).toBe(0);
      expect(resultUndefined.text).toBe('< 1 min read');
    });
  });

  describe('short texts (< 1 min read)', () => {
    it('handles single word', () => {
      const result = readingTime('Hello');
      expect(result.words).toBe(1);
      expect(result.text).toBe('< 1 min read');
      expect(result.minutes).toBe(0.01);
      expect(result.roundedMinutes).toBe(1);
      expect(result.time).toBe(300); // 1 / 200 * 60,000 = 300 ms
    });

    it('handles short sentence', () => {
      const result = readingTime('The quick brown fox jumps over the lazy dog.');
      expect(result.words).toBe(9);
      expect(result.text).toBe('< 1 min read');
      expect(result.minutes).toBe(0.05); // 9 / 200 = 0.045 -> 0.05
      expect(result.roundedMinutes).toBe(1);
      expect(result.time).toBe(2700); // 9 / 200 * 60,000 = 2700 ms
    });
  });

  describe('exact and multi-minute texts', () => {
    it('handles exactly 1 minute of reading (200 words at 200 wpm)', () => {
      const words = Array.from({ length: 200 }, (_, i) => `word${i}`).join(' ');
      const result = readingTime(words);
      expect(result.words).toBe(200);
      expect(result.minutes).toBe(1);
      expect(result.roundedMinutes).toBe(1);
      expect(result.time).toBe(60000);
      expect(result.text).toBe('1 min read');
    });

    it('handles 2.45 minutes of reading (490 words at 200 wpm)', () => {
      const words = Array.from({ length: 490 }, (_, i) => `word${i}`).join(' ');
      const result = readingTime(words);
      expect(result.words).toBe(490);
      expect(result.minutes).toBe(2.45);
      expect(result.roundedMinutes).toBe(3);
      expect(result.time).toBe(147000);
      expect(result.text).toBe('3 min read');
    });

    it('handles 5 minutes of reading (1000 words at 200 wpm)', () => {
      const words = Array.from({ length: 1000 }, (_, i) => `word${i}`).join(' ');
      const result = readingTime(words);
      expect(result.words).toBe(1000);
      expect(result.minutes).toBe(5);
      expect(result.roundedMinutes).toBe(5);
      expect(result.time).toBe(300000);
      expect(result.text).toBe('5 min read');
    });
  });

  describe('custom options', () => {
    it('supports custom wordsPerMinute', () => {
      const words = Array.from({ length: 100 }, (_, i) => `word${i}`).join(' ');

      // At default 200 wpm -> 0.5 min -> < 1 min read
      const defaultRes = readingTime(words);
      expect(defaultRes.minutes).toBe(0.5);
      expect(defaultRes.text).toBe('< 1 min read');

      // At 100 wpm -> 1 min -> 1 min read
      const customRes = readingTime(words, { wordsPerMinute: 100 });
      expect(customRes.minutes).toBe(1);
      expect(customRes.text).toBe('1 min read');
      expect(customRes.time).toBe(60000);

      // At 50 wpm -> 2 min -> 2 min read
      const slowRes = readingTime(words, { wordsPerMinute: 50 });
      expect(slowRes.minutes).toBe(2);
      expect(slowRes.text).toBe('2 min read');
      expect(slowRes.time).toBe(120000);
    });

    it('supports format: compact', () => {
      expect(readingTime('short text', { format: 'compact' }).text).toBe('< 1m');

      const words200 = Array.from({ length: 200 }, () => 'word').join(' ');
      expect(readingTime(words200, { format: 'compact' }).text).toBe('1m');

      const words1000 = Array.from({ length: 1000 }, () => 'word').join(' ');
      expect(readingTime(words1000, { format: 'compact' }).text).toBe('5m');
    });

    it('supports format: raw', () => {
      expect(readingTime('', { format: 'raw' }).text).toBe('0');
      expect(readingTime('hello', { format: 'raw' }).text).toBe('1');

      const words1000 = Array.from({ length: 1000 }, () => 'word').join(' ');
      expect(readingTime(words1000, { format: 'raw' }).text).toBe('5');
    });

    it('supports customFormatter callback', () => {
      const words500 = Array.from({ length: 500 }, () => 'word').join(' ');
      const result = readingTime(words500, {
        customFormatter: ({ words, minutes }) => `Article has ${words} words, taking ~${minutes} min`,
      });

      expect(result.text).toBe('Article has 500 words, taking ~2.5 min');
      expect(result.words).toBe(500);
      expect(result.minutes).toBe(2.5);
    });

    it('throws RangeError for invalid wordsPerMinute', () => {
      expect(() => readingTime('test', { wordsPerMinute: 0 })).toThrow(RangeError);
      expect(() => readingTime('test', { wordsPerMinute: -10 })).toThrow(RangeError);
    });

    it('throws RangeError for invalid cjkCharactersPerMinute', () => {
      expect(() => readingTime('test', { cjkCharactersPerMinute: 0 })).toThrow(RangeError);
      expect(() => readingTime('test', { cjkCharactersPerMinute: -50 })).toThrow(RangeError);
    });
  });

  describe('stripping control flags', () => {
    it('allows disabling stripMarkdown', () => {
      const md = '# Title\n\n```ts\nconsole.log("hello");\n```\n[Link](https://example.com)';

      // With stripping (default): code block stripped, link syntax stripped
      const stripped = readingTime(md);

      // Without stripping: markdown syntax and code block words are counted
      const unstripped = readingTime(md, { stripMarkdown: false });

      expect(unstripped.words).toBeGreaterThan(stripped.words);
    });

    it('allows disabling stripHtml', () => {
      const html = '<div><h1>Title</h1><p>Paragraph text</p></div>';

      const stripped = readingTime(html, { stripHtml: true, stripMarkdown: false });
      const unstripped = readingTime(html, { stripHtml: false, stripMarkdown: false });

      expect(stripped.words).toBe(3); // Title Paragraph text
      expect(unstripped.words).toBeGreaterThan(3); // tags are tokenized as words
    });
  });
});
