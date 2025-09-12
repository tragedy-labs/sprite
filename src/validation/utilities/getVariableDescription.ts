/**
 * Utility funciton to return a description of the variable supplied for validation.
 */
export function getVariableDescription(variable: unknown) {
  return `The supplied argument was: [${JSON.stringify(
    variable
  )}], which is of type: [${typeof variable}].`;
}
