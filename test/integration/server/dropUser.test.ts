// Lib
import { SpriteServer } from '@/server/SpriteServer.js';

// testing
import { variables } from '@test/variables.js';
import { testClient } from './testClient.js';

const config = {
  username: 'dropUserName',
  password: variables.password,
  databases: {
    [variables.databaseName]: '*'
  }
};

let newUserCreated: boolean;

describe('SpriteServer.dropUser', () => {
  beforeAll(async () => {
    // Ensure the user does not exist before starting the tests
    newUserCreated = await testClient.createUser(config).catch(() => true);
  });

  it('should drop a user and return true', async () => {
    if (newUserCreated) {
      /* Arrange & Act */
      const dropped = await testClient.dropUser(config.username);

      /* Assert */
      expect(dropped).toBe(true);
    } else {
      throw new Error('User was not created');
    }
  });

  it('should not allow dropped user to check status of database', async () => {
    /* Arrange */
    const newUserClient = new SpriteServer({
      username: config.username,
      password: config.password,
      address: 'http://localhost:2480'
    });

    /* Act */
    const isReadyPromise = newUserClient.serverReady();

    /* Assert */
    await expect(isReadyPromise).rejects.toMatchSnapshot();
  });

  it('should propagate errors from the database', async () => {
    /* Arrange & Act */
    const dropPromise = testClient.dropUser(config.username);

    /* Assert */
    await expect(dropPromise).rejects.toMatchSnapshot();
  });
});
