import { Database } from '@/database/Database.js';
import { testClient } from '@test/integration/database/testClient.js';
import { TestDatabaseSession as SESSION } from '@test/variables.js';

describe('SpriteClient.setCredentials()', () => {
  it('should create a new DatabaseSession with the provided credentials', async () => {
    jest.spyOn(Database, 'createSession');

    const credentials = { username: 'newUser', password: 'newPassword' };

    await testClient.setCredentials(credentials.username, credentials.password);

    expect(Database.createSession).toHaveBeenCalledWith({
      address: SESSION.address,
      databaseName: SESSION.databaseName,
      password: credentials.password,
      username: credentials.username
    });
  });
});
