// Lib
import { Server, SpriteArcadeServerEvents } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.getEvents()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.getEvents() static method with the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'getEvents');
    // Act
    await SpriteServer.getEvents();
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Server.getEvents() method', async () => {
    // Arrange
    const spy = jest
      .spyOn(Server, 'getEvents')
      .mockImplementationOnce(
        async () => ({ test: 'Data' }) as unknown as SpriteArcadeServerEvents
      );
    // Act
    const result = await SpriteServer.getEvents();
    // Asserts
    expect(result).toEqual({ test: 'Data' });
  });
});
