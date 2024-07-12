import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, headers } from '../../../variables.js';

import { DocumentTypes } from '../../types.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

const dropTypeResult = {
  serverName: '',
  version: '',
  user: variables.username,
  result: []
};

describe('TypedOperations.dropType()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}/${variables.databaseName}`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => dropTypeResult
    } as Response);

    // Act
    await client.dropType<DocumentTypes, TypeName>(typeName);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'sql',
          command: `DROP TYPE ${typeName}`
        })
      }
    );
  });

  it('should properly handle "ifExists" option by appending "IF EXISTS" to the command when passed "true"', async () => {
    // Arrange
    jest.spyOn(SpriteDatabase, 'command').mockResolvedValueOnce(dropTypeResult);

    // Act
    await client.dropType<DocumentTypes, TypeName>(typeName, {
      ifExists: true
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DROP TYPE ${typeName} IF EXISTS`
    );
  });

  it('should properly handle "unsafe" option by appending "UNSAFE" to the command when passed "true"', async () => {
    // Arrange
    jest.spyOn(SpriteDatabase, 'command').mockResolvedValueOnce(dropTypeResult);

    // Act
    await client.dropType<DocumentTypes, TypeName>(typeName, {
      unsafe: true
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DROP TYPE ${typeName} UNSAFE`
    );
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      client.dropType<DocumentTypes, TypeName>(typeName)
    ).rejects.toMatchSnapshot();
  });
});
