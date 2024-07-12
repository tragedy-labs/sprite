import { client, testTransaction } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction as headers
} from '../../../variables.js';

describe('SpriteDatabase.crud()', () => {
  it(`should call SpriteDatabase.command, passing all arguments`, async () => {
    jest.spyOn(client, 'command').mockImplementationOnce(async () => {});

    await client.crud('sql', variables.nonEmptyString, testTransaction);

    expect(client.command).toHaveBeenCalledWith(
      'sql',
      variables.nonEmptyString,
      testTransaction
    );
  });
});
