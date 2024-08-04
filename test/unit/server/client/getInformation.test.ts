// Lib
import { ArcadeServerInformation, Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION } from '@test/variables.js';

describe('SpriteServer.getInformation()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.getInformation() static method with the unique session object and the mode', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'getInformation');
    // Act
    await SpriteServer.getInformation('basic');
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, 'basic');
  });

  it('should call the Server.getInformation() static method with the unique session object and the basic mode', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'getInformation');
    // Act
    await SpriteServer.getInformation('basic');
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, 'basic');
  });

  it('should call the Server.getInformation() static method with the unique session object and the cluster mode', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'getInformation');
    // Act
    await SpriteServer.getInformation('cluster');
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, 'cluster');
  });

  it('should call the Server.getInformation() static method with the unique session object and the default mode', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'getInformation');
    // Act
    await SpriteServer.getInformation('default');
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, 'default');
  });

  it('should return the output of the Server.getInformation() method', async () => {
    // Arrange
    const spy = jest
      .spyOn(Server, 'getInformation')
      .mockImplementationOnce(
        async () =>
          ({ test: 'Data' }) as unknown as ArcadeServerInformation<'basic'>
      );
    // Act
    const result = await SpriteServer.getInformation();
    // Asserts
    expect(result).toEqual({ test: 'Data' });
  });
});
