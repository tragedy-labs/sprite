// Lib
import { SpriteServer } from '@/server/SpriteServer.js';
import { variables } from '@test/variables.js';

// Testing
import { testClient } from './testClient.js';

const config = {
  username: 'createUsername',
  password: variables.password,
  databases: {
    [variables.databaseName]: '*'
  }
};

let newUserClient: SpriteServer;

describe('SpriteServer.createUser', () => {
  beforeAll(async () => {
    newUserClient = new SpriteServer({
      username: config.username,
      password: variables.password,
      address: 'http://localhost:2480'
    });

    // Ensure the user does not exist before starting the tests
    await testClient.dropUser(config.username).catch(() => {});
  });

  it('should create a user and return true', async () => {
    /* Arrange & Act */
    const created = await testClient.createUser(config);

    /* Assert */
    expect(created).toBe(true);
  });

  it('should allow new user to check status of database', async () => {
    /* Arrange & Act */
    const isReady = await newUserClient.serverReady();

    /* Assert */
    expect(isReady).toBe(true);
  });

  it('should propagate errors from the database', async () => {
    /* Arrange & Act */
    const createPromise = testClient.createUser(config);

    /* Assert */
    // Expected to reject because the user already exists
    await expect(createPromise).rejects.toMatchSnapshot();
  });

  it('should prevent dropped user from checking status', async () => {
    /* Arrange */
    const dropped = await testClient.dropUser(config.username);

    /* Act */
    const nonExistantUserPromise = newUserClient.serverReady();

    /* Assert */
    expect(dropped).toBe(true);
    await expect(nonExistantUserPromise).rejects.toMatchSnapshot();
  });
});
