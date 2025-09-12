import { getVariableDescription } from '@/validation/utilities/getVariableDescription.js';

/**
 * Validate a URL (string).
 * @param value The URL to be validated.
 * @returns {boolean} `true` or `false` depending on the validity of the URL
 * @private
 */
export function validateUrl(variable: unknown): boolean {
  try {
    new URL(variable as string);
    return true;
  } catch (error) {
    throw new TypeError(
      `The supplied argument could not be validated as properly formatted URL. ${getVariableDescription(
        variable
      )}`
    );
  }
}
