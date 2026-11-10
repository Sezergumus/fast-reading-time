import { stripHtml, decodeHtmlEntities } from './html';
import { stripMarkdown } from './markdown';

export { stripHtml, decodeHtmlEntities, stripMarkdown };

export interface CleanContentOptions {
  /**
   * Whether to strip Markdown syntax.
   * @default true
   */
  stripMarkdown?: boolean;

  /**
   * Whether to strip HTML tags and entities.
   * @default true
   */
  stripHtml?: boolean;
}

/**
 * Strips Markdown syntax and HTML tags from a text string according to options.
 *
 * @param content The raw content string.
 * @param options Stripping configuration options.
 * @returns Cleaned plain text ready for word counting.
 */
export function cleanContent(content: string, options?: CleanContentOptions): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let text = content;

  // Process markdown stripping first to eliminate fences, blockquotes, links, etc.
  if (options?.stripMarkdown !== false) {
    text = stripMarkdown(text);
  }

  // Then process HTML stripping to remove any raw HTML tags and decode entities
  if (options?.stripHtml !== false) {
    text = stripHtml(text);
  }

  return text.trim();
}
