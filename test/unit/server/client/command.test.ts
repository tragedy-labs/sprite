// Lib
import { Server } from '@/server/Server.js';

// Test
import { client as SpriteServer } from './testClient.js';
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('SpriteServer.command()', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        json: async () => variables.jsonResponse
      } as Response)
    );
  });

  it('should forward all arguments to the Server.command() static method, including the unique session object', async () => {
    // Arrange
    const spy = jest.spyOn(Server, 'command');
    // Act
    await SpriteServer.command(variables.nonEmptyString);
    // Assert
    expect(spy).toHaveBeenCalledWith(SESSION, variables.nonEmptyString);
  });

  it('should return the output of the Server.command() static method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'command')
      .mockImplementationOnce(async () => variables.jsonResponse);
    // Act
    const result = await SpriteServer.command(variables.nonEmptyString);
    // Assert
    expect(result).toEqual(variables.jsonResponse);
  });
});
