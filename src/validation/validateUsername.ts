/**
 * Validate a username is valid for use in ArcadeDB
 * @private
 */
export function validateUsername(input: string) {
  if (!input?.trim()) {
    return false;
  }
  return true;
}
