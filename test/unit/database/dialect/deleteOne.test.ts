import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import {
  variables,
  headersWithTransaction
} from '../../../variables.js';

import { testTransaction } from '../client/testClient.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;

describe('SqlDialect.deleteOne()', () => {
  it('should make a properly formatted POST request to the command endpoint', async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: [] })
    } as Response);

    // Act
    await client.deleteOne(variables.rid, testTransaction);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}/${variables.databaseName}`,
      {
        method: 'POST',
        headers: headersWithTransaction,
        body: JSON.stringify({
          language: 'sql',
          command: 'DELETE FROM #0:0'
        })
      }
    );
  });

  it('should propagate errors from internal method calls', async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'query')
      .mockRejectedValueOnce(new Error('An error occurred'));

    // Act
    const result = client.deleteOne(variables.rid, testTransaction);

    // Assert
    await expect(result).rejects.toMatchSnapshot();
  });
});
