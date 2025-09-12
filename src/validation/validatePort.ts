/**
 * Validate a port number.
 * @private
 */
export function validatePort(input: number): boolean {
  if (!input) {
    return false;
  }
  if (!Number.isInteger(input) || input < 1 || input > 65535) {
    return false;
  }
  return true;
}
