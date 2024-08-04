import { Rest } from '@/rest/Rest.js';
import { Routes } from '@/server/routes.js';
import { Server } from '@/server/Server.js';

import { TestServerSession as SESSION } from '@test/variables.js';

describe('Server.listDatabases()', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid interference
  });
  it('should make a properly formatted fetch request with supplied options', async () => {
    const expectedResponse = ['db1', 'db2'];

    // Mocking Rest.getJson
    jest.spyOn(Rest, 'getJson').mockResolvedValue(expectedResponse);

    const result = await Server.listDatabases(SESSION);

    // Assert
    expect(Rest.getJson).toHaveBeenCalledWith(Routes.DATABASES, SESSION);
    expect(result).toEqual(expectedResponse);
  });

  it('should handle errors thrown by Rest.getJson and rethrow them', async () => {
    const error = new Error('Network error');

    // Mocking Rest.getJson to throw an error
    jest.spyOn(Rest, 'getJson').mockRejectedValue(error);

    await expect(Server.listDatabases(SESSION)).rejects.toThrow(
      'Encountered an error when attemping to fetch list of databases from the server.'
    );
  });
});
