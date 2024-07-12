import {
  ISpriteDatabaseConnectionParameters,
  ISpriteRestClientConnectionParameters
} from '@/types';
import { isNewClient } from '@/utilities/isNewClient';

describe('utilities > isNewClient', () => {
  // export function isNewClient(
  //   parameters:
  //     | ISpriteDatabaseClientParameters
  //     | ISpriteDatabaseConnectionParameters
  // ) {
  //   if (
  //     Object.hasOwn(parameters, 'address') &&
  //     Object.hasOwn(parameters, 'username') &&
  //     Object.hasOwn(parameters, 'password') &&
  //     Object.hasOwn(parameters, 'databaseName')
  //   ) {
  //     return true;
  //   }
  // }
  it('returns true if supplied with ISpriteDatabaseConnectionParameters', () => {
    const params: ISpriteDatabaseConnectionParameters = {
      address: '',
      username: '',
      password: '',
      databaseName: ''
    };
    const result = isNewClient(params);
    expect(result).toBe(true);
  });
  it('returns false if not supplied with ISpriteDatabaseConnectionParameters', () => {
    const params: ISpriteRestClientConnectionParameters = {
      address: '',
      username: '',
      password: ''
    };
    const result = isNewClient(params as ISpriteDatabaseConnectionParameters);
    expect(result).toBe(false);
  });
});
