import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.dropUser()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `DROP USER ${variables.username}`
      })
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.dropUser(variables.username);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });

  // it('should throw an error if no "username" is supplied', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for no arguments in dropUser
  //   expect(() => client.dropUser()).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "username" is an empty string', async () => {
  //   // Act
  //   expect(() => client.dropUser('')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "username" is a string containing only whitespace', async () => {
  //   // Act
  //   expect(() => client.dropUser('   ')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if supplied "username" is a number', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for a number argument in dropUser
  //   expect(() => client.dropUser(9)).rejects.toMatchSnapshot();
  // });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(
      client.dropUser(variables.nonEmptyString)
    ).rejects.toMatchSnapshot();
  });
});
