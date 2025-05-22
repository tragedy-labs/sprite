// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.dropDatabase()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.dropDatabase() static method with the unique session object and the database name', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'dropDatabase');
    // Act
    await SpriteServer.dropDatabase(variables.databaseName);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.databaseName);
  });

  it('should return the output of the Server.dropDatabase() method', async () => {
    // Arrange
    jest.spyOn(Server, 'dropDatabase').mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.dropDatabase(variables.databaseName);
    // Asserts
    expect(result).toBe(true);
  });
});
