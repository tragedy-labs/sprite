import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction as headers
} from '../../../variables.js';

import { DocumentTypes } from '../../types.js';
import { testTransaction } from '../client/testClient.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

const deleteOneResult = [{ count: 1 }];

const deleteOneJsonResponse = {
  user: variables.username,
  serverName: '',
  version: '',
  result: deleteOneResult
};

describe('SpriteOperations.deleteOne()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}/${variables.databaseName}`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => deleteOneJsonResponse
    } as Response);

    // Act
    await client.deleteFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >(typeName, testTransaction, {
      where: [variables.propertyName, '=', variables.rid]
    });

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'sql',
          command: `DELETE FROM ${typeName} WHERE ${variables.propertyName} = '${variables.rid}'`
        })
      }
    );
  });

  it('handles "timeout" option by appending TIMEOUT 1000 to the command when timeout is set to 1000', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockResolvedValueOnce(deleteOneResult);

    // Act
    await client.deleteFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >(typeName, testTransaction, {
      timeout: 1000,
      where: [variables.propertyName, '!!', 'ok']
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DELETE FROM ${typeName} WHERE ${variables.propertyName} !! 'ok' TIMEOUT 1000`,
      testTransaction
    );
  });

  it('handles "return" option by appending RETURN BEFORE to the command when return is set to before', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockResolvedValueOnce(deleteOneResult);

    // Act
    await client.deleteFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >(typeName, testTransaction, {
      return: 'BEFORE',
      where: [variables.propertyName, '!!', 'ok']
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DELETE FROM ${typeName} RETURN BEFORE WHERE ${variables.propertyName} !! 'ok'`,
      testTransaction
    );
  });

  it('handles "limit" option by appending LIMIT 10 to the command when limit is set to 10', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockResolvedValueOnce(deleteOneResult);

    // Act
    await client.deleteFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >(typeName, testTransaction, {
      limit: 10,
      where: [variables.propertyName, '!!', 'ok']
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DELETE FROM ${typeName} WHERE ${variables.propertyName} !! 'ok' LIMIT 10`,
      testTransaction
    );
  });

  it('handles "where" option by appending "WHERE @rid = #0:0" to the command when where is set to ["@rid", "=", "#0:0"]', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockResolvedValueOnce(deleteOneResult);

    // Act
    await client.deleteFrom<
      DocumentTypes,
      TypeName,
      typeof variables.propertyName
    >(typeName, testTransaction, {
      where: [variables.propertyName, '=', variables.rid]
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      'sql',
      `DELETE FROM ${typeName} WHERE ${variables.propertyName} = '${variables.rid}'`,
      testTransaction
    );
  });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      client.deleteFrom<DocumentTypes, TypeName, typeof variables.propertyName>(
        typeName,
        testTransaction
      )
    ).rejects.toMatchSnapshot();
  });
});
