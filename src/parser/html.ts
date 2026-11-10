/**
 * Common HTML named entity mappings.
 */
const HTML_NAMED_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&cent;': '¢',
  '&pound;': '£',
  '&yen;': '¥',
  '&euro;': '€',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&laquo;': '«',
  '&raquo;': '»',
  '&sect;': '§',
  '&deg;': '°',
  '&plusmn;': '±',
  '&para;': '¶',
  '&middot;': '·',
  '&bull;': '•',
};

const NAMED_ENTITY_REGEX = new RegExp(Object.keys(HTML_NAMED_ENTITIES).join('|'), 'gi');

/**
 * Decodes HTML entities (both named and decimal/hex numeric).
 *
 * @param text Text containing HTML entities.
 * @returns Decoded text.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return '';

  return text
    // Replace named entities
    .replace(NAMED_ENTITY_REGEX, (match) => HTML_NAMED_ENTITIES[match.toLowerCase()] ?? match)
    // Replace decimal numeric entities (e.g. &#160; or &#8212;)
    .replace(/&#(\d+);/g, (_, code) => {
      const num = parseInt(code, 10);
      try {
        return String.fromCodePoint(num);
      } catch {
        return '';
      }
    })
    // Replace hexadecimal numeric entities (e.g. &#x2014;)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const num = parseInt(hex, 16);
      try {
        return String.fromCodePoint(num);
      } catch {
        return '';
      }
    });
}

/**
 * Strips HTML tags, scripts, styles, comments, and decodes HTML entities.
 *
 * @param html The HTML string to strip.
 * @returns Clean plain text.
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let text = html;

  // 1. Remove script, style, and svg elements with their inner contents
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  // 2. Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');

  // 3. Remove doctype and XML declarations
  text = text.replace(/<!DOCTYPE[^>]*>/gi, ' ');
  text = text.replace(/<\?[^>]*\?>/g, ' ');

  // 4. Replace block elements and line breaks with spaces so words don't merge
  text = text.replace(/<(?:p|div|br|h[1-6]|li|tr|blockquote|section|article|header|footer|aside)\b[^>]*>/gi, ' ');
  text = text.replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote|section|article|header|footer|aside)>/gi, ' ');

  // 5. Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // 6. Decode HTML entities
  text = decodeHtmlEntities(text);

  // 7. Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}
