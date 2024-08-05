// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import {
  CREATE_USER_PARAMS,
  TestServerSession as SESSION,
  variables
} from '@test/variables.js';

describe('SpriteServer.dropUser()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.dropUser() static method with the unique session object and the user name', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'dropUser');
    // Act
    await SpriteServer.dropUser(variables.username);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, variables.username);
  });

  it('should return the output of the Server.dropUser() method', async () => {
    // Arrange
    const spy = jest
      .spyOn(Server, 'dropUser')
      .mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.dropUser(variables.username);
    // Asserts
    expect(result).toBe(true);
  });
});
