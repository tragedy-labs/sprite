import { validation } from '../../../validation/ArcadeParameterValidation.js';

export function superType<T>(typeName: T) {
  return `EXTENDS ${typeName}`;
}
