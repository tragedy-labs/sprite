import { SIMPLE } from '@/validation/regex/SIMPLE.js';
import { getVariableDescription } from '@/validation/utilities/getVariableDescription.js';

/**
 * Validate a simple identifier
 * @private
 */
export function validateSimplifiedIdentifier(variable: unknown) {
  if (SIMPLE.test(variable as string)) {
    return true;
  } else {
    throw new TypeError(
      `The supplied argument could not be validated as an identifier for ArcadeDB Sprite currently only allows simple identifiers as described in the documentation: https://docs.arcadedb.com/#SQL-Syntax. ${getVariableDescription(
        variable
      )}`
    );
  }
}
