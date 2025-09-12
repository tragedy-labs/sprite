import { SIMPLE } from '@/validation/regex/SIMPLE.js';
import { getVariableDescription } from '@/validation/utilities/getVariableDescription.js';

/**
 * Test a string to validate it as a type name in ArcadeDB.
 * @param value The string to be tested for existence and non-emptiness
 * @returns `true` or `false` depending on the presence of a non-empty string
 * @private
 */
export function validateTypeName(variable: unknown) {
  if (SIMPLE.test(variable as string)) {
    return true;
  } else {
    throw new TypeError(
      `The supplied argument could not be validated as a properly formatted type name for ArcadeDB. ${getVariableDescription(
        variable
      )}`
    );
  }
}
