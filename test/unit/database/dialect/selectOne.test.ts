import { client } from './testClient.js';
import { endpoints } from '../../../../src/endpoints/database.js';
import { variables, headers } from '../../../variables.js';

import { DocumentTypes } from '../../types.js';

const typeName = 'aDocument';
const SpriteDatabase = client.database;
type TypeName = typeof typeName;

describe('SqlDialect.selectOne()', () => {
  it('should make a properly formatted POST request to the command endpoint', async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({ result: [] })
    } as Response);

    // Act
    await client.selectOne<DocumentTypes, TypeName>(variables.rid);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.query}/${variables.databaseName}`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          language: 'sql',
          command: 'SELECT FROM #0:0'
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
    const result = client.selectOne<DocumentTypes, TypeName>(variables.rid);

    // Assert
    await expect(result).rejects.toMatchSnapshot();
  });
});
