import { describe, expect, it } from 'vitest';
import {
  formatReadingTime,
  getLocale,
  getSupportedLocales,
  readingTime,
  registerLocale,
} from '../src';

describe('i18n & Localization', () => {
  const shortText = 'Hello world';
  const oneMinText = Array.from({ length: 200 }, () => 'word').join(' ');
  const fiveMinText = Array.from({ length: 1000 }, () => 'word').join(' ');

  describe('English (en)', () => {
    it('formats English human strings', () => {
      expect(readingTime(shortText, { language: 'en' }).text).toBe('< 1 min read');
      expect(readingTime(oneMinText, { language: 'en' }).text).toBe('1 min read');
      expect(readingTime(fiveMinText, { language: 'en' }).text).toBe('5 min read');
    });

    it('formats English compact strings', () => {
      expect(readingTime(shortText, { language: 'en', format: 'compact' }).text).toBe('< 1m');
      expect(readingTime(oneMinText, { language: 'en', format: 'compact' }).text).toBe('1m');
      expect(readingTime(fiveMinText, { language: 'en', format: 'compact' }).text).toBe('5m');
    });
  });

  describe('Turkish (tr)', () => {
    it('formats Turkish human strings', () => {
      expect(readingTime(shortText, { language: 'tr' }).text).toBe('< 1 dk okuma');
      expect(readingTime(oneMinText, { language: 'tr' }).text).toBe('1 dk okuma');
      expect(readingTime(fiveMinText, { language: 'tr' }).text).toBe('5 dk okuma');
    });

    it('formats Turkish compact strings', () => {
      expect(readingTime(shortText, { language: 'tr', format: 'compact' }).text).toBe('< 1dk');
      expect(readingTime(oneMinText, { language: 'tr', format: 'compact' }).text).toBe('1dk');
      expect(readingTime(fiveMinText, { language: 'tr', format: 'compact' }).text).toBe('5dk');
    });
  });

  describe('Spanish (es)', () => {
    it('formats Spanish human strings', () => {
      expect(readingTime(shortText, { language: 'es' }).text).toBe('< 1 min de lectura');
      expect(readingTime(oneMinText, { language: 'es' }).text).toBe('1 min de lectura');
      expect(readingTime(fiveMinText, { language: 'es' }).text).toBe('5 min de lectura');
    });
  });

  describe('French (fr)', () => {
    it('formats French human strings', () => {
      expect(readingTime(shortText, { language: 'fr' }).text).toBe('< 1 min de lecture');
      expect(readingTime(oneMinText, { language: 'fr' }).text).toBe('1 min de lecture');
      expect(readingTime(fiveMinText, { language: 'fr' }).text).toBe('5 min de lecture');
    });
  });

  describe('German (de)', () => {
    it('formats German human strings', () => {
      expect(readingTime(shortText, { language: 'de' }).text).toBe('< 1 Min. Lesezeit');
      expect(readingTime(oneMinText, { language: 'de' }).text).toBe('1 Min. Lesezeit');
      expect(readingTime(fiveMinText, { language: 'de' }).text).toBe('5 Min. Lesezeit');
    });
  });

  describe('Italian (it)', () => {
    it('formats Italian human strings', () => {
      expect(readingTime(shortText, { language: 'it' }).text).toBe('< 1 min di lettura');
      expect(readingTime(oneMinText, { language: 'it' }).text).toBe('1 min di lettura');
      expect(readingTime(fiveMinText, { language: 'it' }).text).toBe('5 min di lettura');
    });
  });

  describe('Portuguese (pt)', () => {
    it('formats Portuguese human strings', () => {
      expect(readingTime(shortText, { language: 'pt' }).text).toBe('< 1 min de leitura');
      expect(readingTime(oneMinText, { language: 'pt' }).text).toBe('1 min de leitura');
      expect(readingTime(fiveMinText, { language: 'pt' }).text).toBe('5 min de leitura');
    });
  });

  describe('Russian (ru)', () => {
    it('formats Russian human strings', () => {
      expect(readingTime(shortText, { language: 'ru' }).text).toBe('< 1 мин чтения');
      expect(readingTime(oneMinText, { language: 'ru' }).text).toBe('1 мин чтения');
      expect(readingTime(fiveMinText, { language: 'ru' }).text).toBe('5 мин чтения');
    });
  });

  describe('Regional language tags and fallbacks', () => {
    it('matches base language tag for regional codes (e.g. en-US, tr-TR, es-MX)', () => {
      expect(readingTime(oneMinText, { language: 'en-US' }).text).toBe('1 min read');
      expect(readingTime(oneMinText, { language: 'tr-TR' }).text).toBe('1 dk okuma');
      expect(readingTime(oneMinText, { language: 'es-MX' }).text).toBe('1 min de lectura');
      expect(readingTime(oneMinText, { language: 'fr-FR' }).text).toBe('1 min de lecture');
    });

    it('matches base language tag for custom registered regional locales', () => {
      registerLocale('xx', {
        human: {
          lessThanOne: '< 1 xx',
          one: '1 xx',
          other: '{minutes} xx',
        },
        compact: {
          lessThanOne: '< 1x',
          one: '1x',
          other: '{minutes}x',
        },
      });

      expect(readingTime(oneMinText, { language: 'xx-YY' }).text).toBe('1 xx');
    });

    it('falls back gracefully to en for unknown languages', () => {
      expect(readingTime(oneMinText, { language: 'unknown-lang' }).text).toBe('1 min read');
    });
  });

  describe('registerLocale custom localization', () => {
    it('allows registering a new custom language', () => {
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

      expect(readingTime(shortText, { language: 'sv' }).text).toBe('< 1 min lästid');
      expect(readingTime(oneMinText, { language: 'sv' }).text).toBe('1 min lästid');
      expect(readingTime(fiveMinText, { language: 'sv' }).text).toBe('5 min lästid');
    });

    it('throws TypeError when registering invalid language code', () => {
      // @ts-expect-error testing invalid code
      expect(() => registerLocale('', {})).toThrow(TypeError);
    });

    it('returns supported locales list', () => {
      const locales = getSupportedLocales();
      expect(locales).toContain('en');
      expect(locales).toContain('tr');
      expect(locales).toContain('es');
      expect(locales).toContain('sv');
    });

    it('getLocale retrieves valid definition', () => {
      const locale = getLocale('tr');
      expect(locale.human.one).toBe('1 dk okuma');
    });
  });

  describe('formatReadingTime helper', () => {
    it('formats raw objects directly', () => {
      const formatted = formatReadingTime({
        minutes: 2.5,
        roundedMinutes: 3,
        time: 150000,
        words: 500,
        characters: 2500,
        language: 'en',
      });
      expect(formatted).toBe('3 min read');
    });
  });
});
