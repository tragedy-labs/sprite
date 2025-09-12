/**
 * Static methods for validation of arguments in Sprite.
 * @private
 */
export function validateHostname(input: string): boolean {
  if (!input?.trim()) {
    false;
  }

  if (input.length > 253) {
    false;
  }
  return true;
}
