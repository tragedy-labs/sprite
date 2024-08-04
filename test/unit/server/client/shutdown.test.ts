// Lib
import { Server } from '@/server/Server.js';
import { ServerSession } from '@/session/ServerSession.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.shutdown()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.shutdown() static method with the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'shutdown');
    // Act
    await SpriteServer.shutdown();
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Server.shutdown() method', async () => {
    // Arrange
    const spy = jest
      .spyOn(Server, 'shutdown')
      .mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.shutdown();
    // Asserts
    expect(result).toBe(true);
  });
});
