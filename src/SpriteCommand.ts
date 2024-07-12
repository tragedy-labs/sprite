export interface ISpriteCommandOptions {
  initial?: string;
}

/**
 * Used in building SQL commands for use in the `SpriteOperations` class.
 * Contains the string command, and methods for appending strings to
 * the command as directed by the SQL nodes within the operators.
 * @param options Options for initializing the command
 */
export class SpriteCommand {
  private _command: string;
  private separator = ' ';
  constructor(options?: ISpriteCommandOptions) {
    this._command = options?.initial || '';
  }
  /**
   * Accepts a node and the nodes parameters, runs the function
   * with provided parameters and appends it to the command.
   * @param node The node to append to the command
   * @param input The input parameters for the node function
   */
  append = <T>(node: (input: T) => string, input: T) => {
    this._command += `${this.separator}${node(input)}`;
  };
  /**
   * Get the string SQL command.
   * @returns The SQL command as a string
   */
  toString = () => this._command;
}
