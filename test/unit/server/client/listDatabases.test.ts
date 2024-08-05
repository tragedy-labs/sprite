// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.listDatabases()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.listDatabases() static method with the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'listDatabases');
    // Act
    await SpriteServer.listDatabases();
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Server.listDatabases() method', async () => {
    // Arrange
    const spy = jest
      .spyOn(Server, 'listDatabases')
      .mockImplementationOnce(async () => [variables.databaseName]);
    // Act
    const result = await SpriteServer.listDatabases();
    // Asserts
    expect(result).toStrictEqual([variables.databaseName]);
  });
});
