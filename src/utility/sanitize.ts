/**
 * Sanitize input for querying etc.
 *
 * @param text text to sanitize
 */
export default (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s\s+/g, ' ')
    .replace(/[^\w\ ]/g, '')
    .trim();
};
