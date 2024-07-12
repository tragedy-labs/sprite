import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './testClient.js';

describe('SpriteServer.getInformation()', () => {
  it('should make a properly formatted fetch request with supplied options', async () => {
    // Arrange
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${testAuth}`,
        'Content-Type': 'application/json'
      }
    };

    const mode = 'basic';

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => variables.jsonResponse
    } as Response);

    // Act
    await client.getInformation(mode);

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}?mode=${mode}`,
      options
    );
  });

  it('should return the result for a 200 status', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => variables.jsonResponse
    } as Response);

    const response = await client.getInformation();

    expect(response).toBe(variables.jsonResponse.result);
  });

  it('should return an error for a 403 status', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 403
    } as Response);
    expect(() => client.getInformation()).rejects.toMatchSnapshot();
  });
});
