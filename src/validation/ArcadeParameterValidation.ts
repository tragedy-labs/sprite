class ArcadeParameterValidation {
  private SIMPLE_REGEX =
    /^(?!@rid$|@type$|@cat$|@in$|@out$)[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  private RID_REGEX = '';
  constructor() {}
  bucketName = (variable: unknown): boolean => {
    if (
      typeof variable === 'string' &&
      this.SIMPLE_REGEX.test(variable as string)
    ) {
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
  databaseName = (variable: unknown) => {
    if (this.SIMPLE_REGEX.test(variable as string)) {
      return true;
    } else {
      throw new TypeError(
        `The supplied argument could not be validated as a properly formatted database name for ArcadeDB. Names with spaces and odd symbols can cause problems. ${this.getVariableDescription(
          variable
        )}`
      );
    }
  };
  simpleIdentifier = (variable: unknown) => {
    if (this.SIMPLE_REGEX.test(variable as string)) {
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
  typeName = (variable: unknown) => {
    if (this.SIMPLE_REGEX.test(variable as string)) {
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
  url = (variable: unknown): boolean => {
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
  private getVariableDescription = (variable: unknown) => {
    return `The supplied argument was: [${JSON.stringify(
      variable
    )}], which is of type: [${typeof variable}].`;
  };
}

export { ArcadeParameterValidation };

export const validation = new ArcadeParameterValidation();
