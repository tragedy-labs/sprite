// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.disconnectCluster()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.disconnectCluster() static method with the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'disconnectCluster');
    // Act
    await SpriteServer.disconnectCluster();
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Server.disconnectCluster() method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'disconnectCluster')
      .mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.disconnectCluster();
    // Asserts
    expect(result).toBe(true);
  });
});
