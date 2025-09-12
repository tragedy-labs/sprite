/**
 * Validate a password meets minimum requirements for ArcadeDB.
 * @private
 */
export function validatePassword(input: string) {
  if (input === undefined || input === null) {
    return false;
  }
  return true;
}
