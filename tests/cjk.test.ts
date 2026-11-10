import { describe, expect, it } from 'vitest';
import { countWords, readingTime } from '../src';

describe('CJK (Chinese, Japanese, Korean) support', () => {
  describe('word counting for CJK scripts', () => {
    it('counts Chinese characters accurately without spaces', () => {
      // "你好，世界！这是一个测试。" -> 10 Chinese characters
      const text = '你好，世界！这是一个测试。';
      const result = countWords(text);

      expect(result.cjkCharacters).toBe(10);
      expect(result.latinWords).toBe(0);
      expect(result.words).toBe(10);
    });

    it('counts Japanese Kanji, Hiragana, and Katakana', () => {
      // "こんにちは、世界！プログラミングは楽しいです。" -> 20 CJK characters (excluding punctuation)
      const text = 'こんにちは、世界！プログラミングは楽しいです。';
      const result = countWords(text);

      expect(result.cjkCharacters).toBe(20);
      expect(result.latinWords).toBe(0);
      expect(result.words).toBe(20);
    });

    it('counts Korean Hangul characters', () => {
      // "안녕하세요 세상! 프로그래밍은 재미있습니다." -> 17 Hangul characters
      const text = '안녕하세요 세상! 프로그래밍은 재미있습니다.';
      const result = countWords(text);

      expect(result.cjkCharacters).toBe(19);
      expect(result.words).toBe(19);
    });

    it('counts mixed English and CJK text accurately', () => {
      const text = 'Hello world! 你好世界. Welcome to Tokyo 東京!';
      // Latin words: "Hello", "world", "Welcome", "to", "Tokyo" -> 5 words
      // CJK characters: '你', '好', '世', '界', '東', '京' -> 6 characters
      const result = countWords(text);

      expect(result.latinWords).toBe(5);
      expect(result.cjkCharacters).toBe(6);
      expect(result.words).toBe(11); // 5 + 6
    });
  });

  describe('reading time calculation for CJK', () => {
    it('uses 400 cpm for CJK by default', () => {
      // 400 Chinese characters at 400 cpm = 1 minute
      const chineseText = '中'.repeat(400);
      const result = readingTime(chineseText);

      expect(result.words).toBe(400);
      expect(result.minutes).toBe(1);
      expect(result.roundedMinutes).toBe(1);
      expect(result.time).toBe(60000);
      expect(result.text).toBe('1 min read');
    });

    it('blends Latin words (200 wpm) and CJK characters (400 cpm)', () => {
      // 100 latin words at 200 wpm = 0.5 minutes (30,000 ms)
      const latinText = Array.from({ length: 100 }, () => 'word').join(' ');
      // 200 CJK characters at 400 cpm = 0.5 minutes (30,000 ms)
      const cjkText = '中'.repeat(200);

      const mixedText = `${latinText} ${cjkText}`;
      const result = readingTime(mixedText);

      expect(result.words).toBe(300); // 100 + 200
      expect(result.minutes).toBe(1); // 0.5 + 0.5 = 1 min
      expect(result.time).toBe(60000); // 60,000 ms
      expect(result.text).toBe('1 min read');
    });

    it('supports custom cjkCharactersPerMinute', () => {
      // 200 Chinese characters at 200 cpm = 1 minute
      const chineseText = '中'.repeat(200);
      const result = readingTime(chineseText, { cjkCharactersPerMinute: 200 });

      expect(result.minutes).toBe(1);
      expect(result.time).toBe(60000);
    });

    it('localizes Chinese output in zh language', () => {
      const shortChinese = '你好世界';
      expect(readingTime(shortChinese, { language: 'zh' }).text).toBe('少于 1 分钟阅读');

      const longChinese = '中'.repeat(800); // 2 mins
      expect(readingTime(longChinese, { language: 'zh' }).text).toBe('2 分钟阅读');
    });

    it('localizes Japanese output in ja language', () => {
      const shortJapanese = 'こんにちは';
      expect(readingTime(shortJapanese, { language: 'ja' }).text).toBe('1分未満で読めます');

      const longJapanese = '日'.repeat(800); // 2 mins
      expect(readingTime(longJapanese, { language: 'ja' }).text).toBe('2分で読めます');
    });
  });
});
