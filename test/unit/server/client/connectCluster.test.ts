// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.connectCluster()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should call the Server.connectCluster() static method with the unique session object and the address', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'connectCluster');
    // Act
    await SpriteServer.connectCluster(variables.address);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.address);
  });

  it('should return the output of the Server.connectCluster() static method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'connectCluster')
      .mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.connectCluster(variables.address);
    // Asserts
    expect(result).toBe(true);
  });
});
