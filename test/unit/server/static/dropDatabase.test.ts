// Lib
import { Routes } from '@/server/routes.js';
import { Server } from '@/server/Server.js';

// Testing
import {
  TestServerSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.COMMAND}`;

describe('Server.dropDatabase()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command: `DROP DATABASE ${variables.databaseName}`
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await Server.dropDatabase(SESSION, variables.databaseName);

    // Assert
    expect(fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  // it('should throw an error if no "databaseName" is supplied', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for no arguments in dropDatabase
  //   await expect(Server.dropDatabase()).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "databaseName" is an empty string', async () => {
  //   // Act
  //   await expect(Server.dropDatabase('')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if "databaseName" is a string containing only whitespace', async () => {
  //   // Act
  //   await expect(Server.dropDatabase('   ')).rejects.toMatchSnapshot();
  // });

  // it('should throw an error if supplied "databaseName" is a number', async () => {
  //   // Act
  //   // @ts-expect-error - Testing error handling for a number argument in dropDatabase
  //   await expect(Server.dropDatabase(9)).rejects.toMatchSnapshot();
  // });

  it('should propagate errors from internal methods', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));
    expect(() =>
      Server.dropDatabase(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
