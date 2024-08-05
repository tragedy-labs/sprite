// Lib
import { Routes } from '@/server/routes.js';
import { Server } from '@/server/Server.js';
import { SpriteDatabase } from '@/database/SpriteDatabase.js';

// Testing
import {
  TestServerSession as SESSION,
  headers,
  variables
} from '@test/variables.js';

const ENDPOINT = `${variables.address}${variables.apiRoute}${Routes.COMMAND}`;

describe('SpriteServer.createDatabase()', () => {
  it(`should make a properly formatted POST request to ${ENDPOINT}`, async () => {
    // Arrange
    const REQUEST_INIT: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        command: `CREATE DATABASE ${variables.databaseName}`
      }),
      keepalive: true
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'ok' })
    } as Response);

    // Act
    await Server.createDatabase(SESSION, variables.databaseName);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, REQUEST_INIT);
  });

  it('should return an instance of SpriteDatabase with the created database as a target.', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'ok' })
    } as Response);

    expect(
      await Server.createDatabase(SESSION, variables.databaseName)
    ).toBeInstanceOf(SpriteDatabase);
  });

  it('should throw an error if no "databaseName" is supplied', async () => {
    // Act
    // @ts-expect-error - Testing error handling for db name in createDatabase
    expect(() => Server.createDatabase(SESSION)).rejects.toMatchSnapshot();
  });

  it('should throw an error if "databaseName" is an empty string', async () => {
    // Act
    expect(() => Server.createDatabase(SESSION, '')).rejects.toMatchSnapshot();
  });

  it('should throw an error if "databaseName" is a string containing only whitespace', async () => {
    // Act
    expect(() =>
      Server.createDatabase(SESSION, '   ')
    ).rejects.toMatchSnapshot();
  });

  it('should throw an error if supplied "databaseName" is a number', async () => {
    // Act
    // @ts-expect-error - Testing error handling for a number argument in createDatabase
    expect(() => Server.createDatabase(SESSION, 9)).rejects.toMatchSnapshot();
  });

  it('should throw an error if fetch returns a non "ok" result property in the response object', () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'not ok' })
    } as Response);

    expect(
      Server.createDatabase(SESSION, variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
