import { Transaction } from '@/database/transaction/Transaction.js';
import { SIMPLE } from './regex/SIMPLE.js';

// TODO: Change the name of this to Validate or something like that,
// it doesn't only validate ArcadeDB stuff.

/**
 * Static methods for validation of arguments in Sprite.
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

/**
 * Validate a port number.
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

/**
 * Validate an `Transaction` object
 */
export function validateTransaction(trx: Transaction) {
  if (trx instanceof Transaction && trx.id) {
    return true;
  } else {
    throw new TypeError(
      `Recieved an argument that could not be validated as a SpriteTransaction. ${getVariableDescription(
        trx
      )}`
    );
  }
}

/**
 * Validate a username is valid for use in ArcadeDB
 */
export function validateUsername(input: string) {
  if (!input?.trim()) {
    return false;
  }
  return true;
}

/**
 * Validate a password meets minimum requirements for ArcadeDB.
 */
export function validatePassword(input: string) {
  if (input === undefined || input === null) {
    return false;
  }
  return true;
}

/**
 * Validate a string for use as a `bucket` name in ArcadeDB
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

/**
 * Test a string to validate it as a database name in ArcadeDB.
 * @param value The string to be tested for existence and non-emptiness
 * @returns `true` or `false` depending on the presence of a non-empty string
 */
export function validateDatabaseName(variable: unknown) {
  if (SIMPLE.test(variable as string)) {
    return true;
  } else {
    throw new TypeError(
      `The supplied argument could not be validated as a properly formatted database name for ArcadeDB. Names with spaces and odd symbols can cause problems. ${getVariableDescription(
        variable
      )}`
    );
  }
}

/**
 * Validate a simple identifier
 */
export function validateSimpleIdentifier(variable: unknown) {
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

/**
 * Test a string to validate it as a type name in ArcadeDB.
 * @param value The string to be tested for existence and non-emptiness
 * @returns `true` or `false` depending on the presence of a non-empty string
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

/**
 * Validate a URL (string).
 * @param value The URL to be validated.
 * @returns {boolean} `true` or `false` depending on the validity of the URL
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

/**
 * Utility funciton to return a description of the variable supplied for validation.
 */
function getVariableDescription(variable: unknown) {
  return `The supplied argument was: [${JSON.stringify(
    variable
  )}], which is of type: [${typeof variable}].`;
}
