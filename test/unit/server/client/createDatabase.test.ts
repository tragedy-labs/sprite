// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';
import { SPRITE_DATABASE } from '@test/unit/database/client/testClient.js';

describe('SpriteServer.createDatabase()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.createDatabase() static method with the unique session object and the database name', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'createDatabase');
    // Act
    await SpriteServer.createDatabase(variables.databaseName);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.databaseName);
  });

  it('should return the output of the Server.createDatabase() static method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'createDatabase')
      .mockImplementationOnce(async () => SPRITE_DATABASE);
    // Act
    const result = await SpriteServer.createDatabase(variables.databaseName);
    // Asserts
    expect(result).toBe(SPRITE_DATABASE);
  });
});
