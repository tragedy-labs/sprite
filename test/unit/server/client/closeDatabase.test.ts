// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.closeDatabase()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.closeDatabase() static method with the unique session object and the database name', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'closeDatabase');
    // Act
    await SpriteServer.closeDatabase(variables.databaseName);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.databaseName);
  });

  it('should return the output of the Server.closeDatabase() static method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'closeDatabase')
      .mockImplementationOnce(async () => false);
    // Act
    const result = await SpriteServer.closeDatabase(variables.databaseName);
    // Asserts
    expect(result).toBe(false);
  });
});
