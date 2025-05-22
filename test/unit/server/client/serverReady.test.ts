// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.serverReady()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.serverReady() static method with the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'serverReady');
    // Act
    await SpriteServer.serverReady();
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Server.serverReady() method', async () => {
    // Arrange
    jest.spyOn(Server, 'serverReady').mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.serverReady();
    // Asserts
    expect(result).toBe(true);
  });
});
