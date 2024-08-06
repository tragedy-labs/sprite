// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import {
  CREATE_USER_PARAMS,
  TestServerSession as SESSION
} from '@test/variables.js';

describe('SpriteServer.createUser()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => ({
          result: 'ok'
        })
      } as Response)
    );
  });

  it('should call the Server.createUser() static method with the unique session object and createUser parameters', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'createUser');
    // Act
    await SpriteServer.createUser(CREATE_USER_PARAMS);
    // Asserts
    expect(spy).toHaveBeenCalledWith(SESSION, CREATE_USER_PARAMS);
  });

  it('should return the output of the Server.createUser() static method', async () => {
    // Arrange
    jest.spyOn(Server, 'createUser').mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteServer.createUser(CREATE_USER_PARAMS);
    // Asserts
    expect(result).toBe(true);
  });
});
