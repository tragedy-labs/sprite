import { endpoints } from '../../../src/endpoints/server.js';
import { testAuth, variables } from '../../variables.js';
import { client } from './utilities/testClient.js';

describe('Sprite.command()', () => {
  it('should make a properly formatted fetch request with supplied parameters', async () => {
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
    await client.serverCommand('non-empty string');

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      `${variables.address}${endpoints.command}`,
      options
    );
  });
  it('should propagate errors from internal methods calls', ()=>{
    // Arrange
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('test error'));
    // Act
    // Assert
    expect(client.serverCommand('non-empty string')).rejects.toMatchSnapshot();
  });
});
