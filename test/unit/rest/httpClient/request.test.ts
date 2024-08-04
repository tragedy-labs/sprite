import { HttpClient, SpriteRequestInit } from '@/rest/HttpClient.js';
import { ArcadeFetchError } from '@/errors/ArcadeFetchError.js';

describe('HttpClient.request', () => {
  const endpoint = 'http://localhost:2480/api/vi/ready';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a POST request', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({})
    } as Response);

    const init: SpriteRequestInit = {
      body: 'body',
      method: 'POST',
      headers: {
        Authorization: '',
        'Content-Type': 'application/json'
      }
    };

    await HttpClient.request(endpoint, init);

    expect(global.fetch).toHaveBeenCalledWith(endpoint, init);
  });

  it('should handle a GET request', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 200,
      json: async () => ({})
    } as Response);

    const init: SpriteRequestInit = {
      method: 'GET',
      headers: {
        Authorization: '',
        'Content-Type': 'application/json'
      }
    };

    await HttpClient.request(endpoint, init);
    expect(global.fetch).toHaveBeenCalledWith(endpoint, init);
  });

  it('should handle a 403 error response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 403
    } as Response);

    const init: SpriteRequestInit = {
      body: 'body',
      method: 'POST',
      headers: {
        Authorization: '',
        'Content-Type': 'application/json'
      }
    };

    await expect(HttpClient.request(endpoint, init)).rejects.toThrow(
      ArcadeFetchError
    );
  });

  it('should handle a 404 error response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      status: 404
    } as Response);

    const init: SpriteRequestInit = {
      body: 'body',
      method: 'POST',
      headers: {
        Authorization: '',
        'Content-Type': 'application/json'
      }
    };

    await expect(HttpClient.request(endpoint, init)).rejects.toThrow(
      ArcadeFetchError
    );
  });
});
