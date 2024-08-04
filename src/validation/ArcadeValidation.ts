import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { SIMPLE } from './regex/SIMPLE.js';

// TODO: Change the name of this to Validate or something like that,
// it doesn't only validate ArcadeDB stuff.

/**
 * Static methods for validation of arguments in Sprite.
 */
class ArcadeValidation {
  public static transaction = (trx: SpriteTransaction) => {
    if (trx instanceof SpriteTransaction && trx.id) {
      return true;
    } else {
      throw new TypeError(
        `Recieved an argument that could not be validated as a SpriteTransaction. ${this.getVariableDescription(
          trx
        )}`
      );
    }
  };
  public static bucketName = (variable: unknown): boolean => {
    if (typeof variable === 'string' && SIMPLE.test(variable as string)) {
      return true;
    }
    if (Array.isArray(variable)) {
      return variable.every((item: string) => this.bucketName(item));
    }
    throw new TypeError(
      `The supplied argument could not be validated as a properly formatted bucket name for ArcadeDB. ${this.getVariableDescription(
        variable
      )}`
    );
  };
  /**
   * Test a string to validate it as a database name in ArcadeDB.
   * @param value The string to be tested for existence and non-emptiness
   * @returns {boolean} `true` or `false` depending on the presence of a non-empty string
   */
  public static databaseName = (variable: unknown) => {
    if (SIMPLE.test(variable as string)) {
      return true;
    } else {
      throw new TypeError(
        `The supplied argument could not be validated as a properly formatted database name for ArcadeDB. Names with spaces and odd symbols can cause problems. ${this.getVariableDescription(
          variable
        )}`
      );
    }
  };
  public static simpleIdentifier = (variable: unknown) => {
    if (SIMPLE.test(variable as string)) {
      return true;
    } else {
      throw new TypeError(
        `The supplied argument could not be validated as an identifier for ArcadeDB Sprite currently only allows simple identifiers as described in the documentation: https://docs.arcadedb.com/#SQL-Syntax. ${this.getVariableDescription(
          variable
        )}`
      );
    }
  };
  /**
   * Test a string to validate it as a type name in ArcadeDB.
   * @param value The string to be tested for existence and non-emptiness
   * @returns {boolean} `true` or `false` depending on the presence of a non-empty string
   */
  public static typeName = (variable: unknown) => {
    if (SIMPLE.test(variable as string)) {
      return true;
    } else {
      throw new TypeError(
        `The supplied argument could not be validated as a properly formatted type name for ArcadeDB. ${this.getVariableDescription(
          variable
        )}`
      );
    }
  };
  /**
   * Validate a URL (string).
   * @param value The URL to be validated.
   * @returns {boolean} `true` or `false` depending on the validity of the URL
   */
  public static url = (variable: unknown): boolean => {
    try {
      new URL(variable as string);
      return true;
    } catch (error) {
      throw new TypeError(
        `The supplied argument could not be validated as properly formatted URL. ${this.getVariableDescription(
          variable
        )}`
      );
    }
  };
  private static getVariableDescription = (variable: unknown) => {
    return `The supplied argument was: [${JSON.stringify(
      variable
    )}], which is of type: [${typeof variable}].`;
  };
}

export { ArcadeValidation };

export const validation = new ArcadeValidation();
