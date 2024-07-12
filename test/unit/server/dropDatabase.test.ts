import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.dropDatabase()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `DROP DATABASE ${variables.databaseName}`
      })
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.dropDatabase(variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });

  // it('should throw an error if no "databaseName" is supplied', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for no arguments in dropDatabase
  //   await expect(client.dropDatabase()).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "databaseName" is an empty string', async () => {
  //   // Act
  //   await expect(client.dropDatabase('')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "databaseName" is a string containing only whitespace', async () => {
  //   // Act
  //   await expect(client.dropDatabase('   ')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if supplied "databaseName" is a number', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for a number argument in dropDatabase
  //   await expect(client.dropDatabase(9)).rejects.toMatchSnapshot();
  // });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      client.dropDatabase(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
