import { SIMPLE } from '@/validation/regex/SIMPLE.js';
import { getVariableDescription } from '@/validation/utilities/getVariableDescription.js';

/**
 * Validate a string for use as a `bucket` name in ArcadeDB
 * @private
 */
export function validateBucketName(variable: unknown): boolean {
  if (typeof variable === 'string' && SIMPLE.test(variable as string)) {
    return true;
  }
  if (Array.isArray(variable)) {
    return variable.every((item: string) => validateBucketName(item));
  }
  throw new TypeError(
    `The supplied argument could not be validated as a properly formatted bucket name for ArcadeDB. ${getVariableDescription(
      variable
    )}`
  );
}
