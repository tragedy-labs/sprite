// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';
import { SPRITE_DATABASE } from '@test/unit/database/client/testClient.js';

describe('SpriteServer.database()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.database() static method with the unique session object and the database name', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'database');
    // Act
    await SpriteServer.database(variables.databaseName);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.databaseName);
  });

  it('should return the output of the Server.database() static method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'database')
      .mockImplementationOnce(() => SPRITE_DATABASE);
    // Act
    const result = await SpriteServer.database(variables.databaseName);
    // Asserts
    expect(result).toBe(SPRITE_DATABASE);
  });
});
