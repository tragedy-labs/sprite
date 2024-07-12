import { validation } from '../../../validation/ArcadeParameterValidation.js';

export function type<T>(typeName: T) {
  try {
    validation.typeName(typeName);
    return `TYPE ${typeName}`;
  } catch (error) {
    throw new Error(`Could not generate TYPE node for type: [${typeName}]`, {
      cause: error
    });
  }
}
