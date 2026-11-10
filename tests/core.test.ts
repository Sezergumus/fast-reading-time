import { describe, expect, it } from 'vitest';
import { calculateReadingTime, countWords } from '../src';

describe('Word Counter Core', () => {
  it('counts words in empty and falsy input', () => {
    // @ts-expect-error testing falsy inputs
    expect(countWords(null)).toEqual({
      words: 0,
      characters: 0,
      latinWords: 0,
      cjkCharacters: 0,
    });
    // @ts-expect-error testing falsy inputs
    expect(countWords(undefined)).toEqual({
      words: 0,
      characters: 0,
      latinWords: 0,
      cjkCharacters: 0,
    });
    expect(countWords('')).toEqual({
      words: 0,
      characters: 0,
      latinWords: 0,
      cjkCharacters: 0,
    });
  });

  it('handles words with contractions, hyphens, and apostrophes', () => {
    const text = "It's a state-of-the-art implementation that doesn't fail.";
    const result = countWords(text);
    // Words: "It's", "a", "state-of-the-art", "implementation", "that", "doesn't", "fail" -> 7
    expect(result.words).toBe(7);
  });

  it('handles accented and non-ASCII Latin characters', () => {
    const text = 'café crème brûlée señorita schön İstanbul';
    const result = countWords(text);
    expect(result.words).toBe(6);
  });

  it('handles emojis properly without breaking character count', () => {
    const text = '🚀 Hello 🌍 World! 🎉';
    const result = countWords(text);
    expect(result.words).toBe(2);
    // Array.from splits emojis properly by code points
    expect(result.characters).toBe(Array.from(text).length);
  });

  it('supports custom wordPattern', () => {
    const text = 'apple123 orange456 banana';
    // Match only pure alphabetic words
    const result = countWords(text, { wordPattern: /[a-zA-Z]+/g });
    expect(result.words).toBe(3);
  });
});

describe('Calculator Core', () => {
  it('handles zero words', () => {
    const result = calculateReadingTime({
      words: 0,
      characters: 0,
      latinWords: 0,
      cjkCharacters: 0,
    });
    expect(result).toEqual({
      minutes: 0,
      roundedMinutes: 0,
      time: 0,
      words: 0,
      characters: 0,
    });
  });

  it('calculates accurate minutes and milliseconds', () => {
    const result = calculateReadingTime(
      {
        words: 300,
        characters: 1500,
        latinWords: 300,
        cjkCharacters: 0,
      },
      { wordsPerMinute: 200 }
    );

    expect(result.minutes).toBe(1.5);
    expect(result.roundedMinutes).toBe(2);
    expect(result.time).toBe(90000); // 1.5 * 60,000 = 90,000 ms
    expect(result.words).toBe(300);
    expect(result.characters).toBe(1500);
  });

  it('throws RangeError if wordsPerMinute <= 0', () => {
    expect(() =>
      calculateReadingTime(
        { words: 10, characters: 50, latinWords: 10, cjkCharacters: 0 },
        { wordsPerMinute: 0 }
      )
    ).toThrow(RangeError);

    expect(() =>
      calculateReadingTime(
        { words: 10, characters: 50, latinWords: 10, cjkCharacters: 0 },
        { wordsPerMinute: -5 }
      )
    ).toThrow(RangeError);
  });

  it('throws RangeError if cjkCharactersPerMinute <= 0', () => {
    expect(() =>
      calculateReadingTime(
        { words: 10, characters: 50, latinWords: 10, cjkCharacters: 0 },
        { cjkCharactersPerMinute: 0 }
      )
    ).toThrow(RangeError);
  });
});
