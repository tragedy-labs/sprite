import { endpoints } from '../../../src/endpoints/server.js';
import { client } from './utilities/testClient.js';
import { variables, testAuth } from '../../variables.js';

describe('SpriteBase.fetchJson()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: 'non-empty string' })
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.fetchJson(endpoints.command, options);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });
  it('should return the result property of the response json object', async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    const result = await client.fetchJson(endpoints.command);

    expect(result).toBe(variables.jsonResponse.result);
  });

  it('should return the json object if it does not have a result property', async () => {
    // Arrange

    const oddJsonResult = { a: 1, b: 2, c: 3 };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: async () => (oddJsonResult)
    } as Response);

    // Act
    const result = await client.fetchJson(endpoints.command);

    expect(result).toBe(oddJsonResult);
  });

  it(`should throw an ArcadeDatabaseError when it receives an object with an error property`, async () => {
    // Arrange
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        error: 'test',
        detail: 'test details'
      })
    } as Response);

    // Act & Assert
    expect(client.fetchJson(endpoints.command)).rejects.toMatchSnapshot();
  });

  it('should propagate errors from internal methods', async () => {
    // Arrange
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new TypeError('fetch failed'));

    // Assert & Act
    await expect(client.fetchJson(endpoints.command)).rejects.toMatchSnapshot();
  });
});
