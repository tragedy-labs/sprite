import {
  ISpriteDatabaseClientParameters,
  ISpriteDatabaseConnectionParameters
} from '../types/database.js';

export function isNewClient(
  parameters:
    | ISpriteDatabaseClientParameters
    | ISpriteDatabaseConnectionParameters
) {
  if (
    Object.hasOwn(parameters, 'address') &&
    Object.hasOwn(parameters, 'username') &&
    Object.hasOwn(parameters, 'password') &&
    Object.hasOwn(parameters, 'databaseName')
  ) {
    return true;
  } else {
    return false;
  }
}
