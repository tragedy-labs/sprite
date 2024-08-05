// Lib
import { variables } from '@test/variables.js';
import { testClient } from './testClient.js';

const newDatabaseName = 'CreateDatabaseTestDatabase';

describe('SpriteServer.createDatabase', () => {
  afterAll(async () => {
    await testClient.dropDatabase(newDatabaseName);
  });

  it('should create a database', async () => {
    /* Arrange */
    await testClient.createDatabase(newDatabaseName);

    /* Act */
    const list = await testClient.listDatabases();

    /* Assert */
    const databaseCreated = list.includes(newDatabaseName);
    expect(databaseCreated).toBe(true);
  });

  it('should propagate errors from the database', async () => {
    /* Arrange & Act */
    const createPromise = testClient.createDatabase(newDatabaseName);

    /* Assert */
    // Expect an error because the database already exists
    await expect(createPromise).rejects.toMatchSnapshot();
  });
});
