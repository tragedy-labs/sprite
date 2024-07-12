import { variables } from '../variables.js';
import { testClient } from './testClient.js';

describe('SpriteServer.databaseExists', () => {
  it('should return true if the test database exits', async () => {
    /* Arrange & Act */
    const exists = await testClient.databaseExists(variables.databaseName);

    /* Assert */
    expect(exists).toBe(true);
  });

  it('should return false if the database does not exist', async () => {
    /* Arrange & Act */
    const exists = await testClient.databaseExists('FAKE_DATABASE');

    /* Assert */
    expect(exists).toBe(false);
  });
});
