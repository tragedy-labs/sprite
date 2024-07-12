import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction as headers
} from '../../../variables.js';

import { DocumentTypes } from '../../types.js';
import { testTransaction } from '../client/testClient.js';
import { ArcadeCommandResponse } from '../../../../src/api.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

const data = {
  aProperty: 'aValue'
};

describe('TypedOperations.insertRecord()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}/${variables.databaseName}`, async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: [{ count: 1 }] })
    } as Response);

    await client.insertRecord<DocumentTypes, TypeName>(
      'aDocument',
      testTransaction,
      {
        data: {
          aProperty: 'aValue'
        }
      }
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'sql',
          command: `INSERT INTO ${typeName} CONTENT ${JSON.stringify({
            aProperty: 'aValue'
          })}`
        })
      }
    );
  });

  it(`handles "bucket" option by appending "BUCKET:${variables.bucketName}" instead of a typename to the command when bucket is set to "${variables.bucketName}"`, async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async () =>
          ({ result: [{ count: 0 }] }) as ArcadeCommandResponse<unknown>
      );

    await client.insertRecord<DocumentTypes, TypeName>(
      'aDocument',
      testTransaction,
      {
        bucket: variables.bucketName
      }
    );

    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `INSERT INTO BUCKET:${variables.bucketName}`,
      testTransaction
    );
  });

  it(`handles "data" option by appending CONTENT ${JSON.stringify(
    data
  )} to the command when data is set to ${data}`, async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async () =>
          ({ result: [{ count: 0 }] }) as ArcadeCommandResponse<unknown>
      );

    await client.insertRecord<DocumentTypes, TypeName>(
      'aDocument',
      testTransaction,
      {
        data
      }
    );

    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `INSERT INTO aDocument CONTENT ${JSON.stringify(data)}`,
      testTransaction
    );
  });

  it('propagates errors from internal methods', async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(
      client.insertRecord<DocumentTypes, TypeName>(
        'aDocument',
        testTransaction,
        {
          data
        }
      )
    ).rejects.toMatchSnapshot();
  });
});
