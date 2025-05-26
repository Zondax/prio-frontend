/**
 * Formats text by splitting it into paragraphs at newline characters
 * and removing any empty lines.
 *
 * @param input - The string to format
 * @returns An array of non-empty paragraph strings
 */
export function formatText(input: string): string[] {
  return input.split('\n').filter(Boolean)
}
