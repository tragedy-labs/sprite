import { SpriteDatabase } from '../../../src/SpriteDatabase.js';
import { variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.database()', () => {
  it('should return an instance of SpriteDatabase', async () => {
    const database = client.database(variables.databaseName);
    // Assert
    expect(database).toBeInstanceOf(SpriteDatabase);
  });
});
