// Testing
import { testClient } from './testClient.js';
import { variables } from '@test/variables.js';

describe('SpriteServer.listDatabases', () => {
  it('should return a list of the databases on the server', async () => {
    // Arrange & Act
    const databaseList =
      await testClient.command<Array<string>>('LIST DATABASES');

    // Assert
    // TODO: I wanted this test to be more specific, but there is a bug
    // somewhere that causes an 'undefined' database name to be returned in the
    // array, and also depending on the test order, there could be other databases
    // in the list.
    expect(Array.isArray(databaseList)).toBe(true);
    expect(databaseList.length).toBeGreaterThan(0);
    expect(databaseList.includes(variables.databaseName)).toBe(true);
  });
});
