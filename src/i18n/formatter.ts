import { DEFAULT_FORMAT, DEFAULT_LANGUAGE } from '../constants';
import type { LocaleDefinition, OutputFormat, RawReadingTime } from '../types';
import { LOCALES } from './locales';

/**
 * Registry of supported locales, initialized with built-in locales.
 */
const customLocales: Record<string, LocaleDefinition> = {};

/**
 * Registers a new custom locale or overrides an existing one.
 *
 * @param language Language code (e.g. 'sv', 'el', 'custom').
 * @param definition Locale dictionary definition.
 */
export function registerLocale(language: string, definition: LocaleDefinition): void {
  if (!language || typeof language !== 'string') {
    throw new TypeError('Language code must be a non-empty string');
  }
  customLocales[language.toLowerCase().trim()] = definition;
}

/**
 * Returns an array of all currently registered language codes.
 */
export function getSupportedLocales(): string[] {
  const allCodes = new Set([
    ...Object.keys(LOCALES),
    ...Object.keys(customLocales),
  ]);
  return Array.from(allCodes);
}

/**
 * Retrieves the locale definition for a given language code.
 * Falls back to 'en' if the requested language is not registered.
 *
 * @param language Language code (e.g. 'en', 'tr', 'en-US', 'es-ES').
 * @returns LocaleDefinition
 */
export function getLocale(language: string = DEFAULT_LANGUAGE): LocaleDefinition {
  const normalized = language.toLowerCase().trim();

  // 1. Direct match (e.g. 'en', 'tr')
  if (customLocales[normalized]) return customLocales[normalized];
  if (LOCALES[normalized]) return LOCALES[normalized];

  // 2. Base language tag match (e.g. 'en-US' -> 'en', 'zh-CN' -> 'zh')
  const baseTag = normalized.split(/[-_]/)[0];
  if (baseTag) {
    if (customLocales[baseTag]) return customLocales[baseTag];
    if (LOCALES[baseTag]) return LOCALES[baseTag];
  }

  // 3. Fallback to English
  return LOCALES[DEFAULT_LANGUAGE]!;
}

export interface FormatOptions {
  language?: string;
  format?: OutputFormat;
  customFormatter?: (result: RawReadingTime) => string;
}

/**
 * Formats raw reading time metrics into a humanized string, compact string, or raw number.
 *
 * @param raw The raw reading time metrics.
 * @param options Formatting options including language and format style.
 * @returns Formatted time string.
 */
export function formatReadingTime(raw: RawReadingTime, options?: FormatOptions): string {
  // If custom formatter is provided, use it directly
  if (typeof options?.customFormatter === 'function') {
    return options.customFormatter(raw);
  }

  const format = options?.format ?? raw.format ?? DEFAULT_FORMAT;

  // Raw format returns the stringified rounded minutes (or "0" when empty)
  if (format === 'raw') {
    if (raw.words === 0) {
      return '0';
    }
    return String(raw.roundedMinutes);
  }

  const language = options?.language ?? raw.language ?? DEFAULT_LANGUAGE;
  const locale = getLocale(language);
  const patterns = format === 'compact' ? locale.compact : locale.human;

  const { minutes, roundedMinutes, words } = raw;

  // When text has 0 words, or reading time is less than 1 minute
  if (words === 0 || minutes < 1) {
    return patterns.lessThanOne;
  }

  // Exactly 1 minute (or rounded to 1 minute)
  if (roundedMinutes === 1) {
    return patterns.one;
  }

  // More than 1 minute
  return patterns.other
    .replace(/\{minutes\}/g, String(roundedMinutes))
    .replace(/\{n\}/g, String(roundedMinutes));
}
