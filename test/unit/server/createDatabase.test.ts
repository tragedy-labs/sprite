import { SpriteDatabase } from '@/SpriteDatabase.js';
import { endpoints } from '@/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.createDatabase()', () => {
  it(`should make a properly formatted POST request to ${endpoints.command}`, async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: `CREATE DATABASE ${variables.databaseName}`
      })
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'ok' })
    } as Response);

    // Act
    await client.createDatabase(variables.databaseName);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });

  it('should return an instance of SpriteDatabase with the created database as a target.', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'ok' })
    } as Response);

    expect(await client.createDatabase(variables.databaseName)).toBeInstanceOf(
      SpriteDatabase
    );
  });

  it('should throw an error if no "databaseName" is supplied', async () => {
    // Act
    // @ts-expect-error - Testing error handling for no arguments in createDatabase
    expect(() => client.createDatabase()).rejects.toMatchSnapshot();
  });

  it('should throw an error if "databaseName" is an empty string', async () => {
    // Act
    expect(() => client.createDatabase('')).rejects.toMatchSnapshot();
  });

  it('should throw an error if "databaseName" is a string containing only whitespace', async () => {
    // Act
    expect(() => client.createDatabase('   ')).rejects.toMatchSnapshot();
  });

  it('should throw an error if supplied "databaseName" is a number', async () => {
    // Act
    // @ts-expect-error - Testing error handling for a number argument in createDatabase
    expect(() => client.createDatabase(9)).rejects.toMatchSnapshot();
  });

  it('should throw an error if fetch returns a non "ok" result property in the response object', () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ result: 'not ok' })
    } as Response);

    expect(
      client.createDatabase(variables.databaseName)
    ).rejects.toMatchSnapshot();
  });
});
