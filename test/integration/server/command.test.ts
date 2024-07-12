import { variables } from '../variables.js';
import { testClient } from './testClient.js';

describe('SpriteServer.command', () => {
  it('should execute a command', async () => {
    // Arrange & Act
    const databaseList =
      await testClient.command<Array<string>>('LIST DATABASES');

    // Assert
    expect(databaseList.includes(variables.databaseName)).toBe(true);
  });

  it('should propagate errors from the database', async () => {
    // Arrange & Act
    const invalidCommandPromise = testClient.command('INVALID_COMMAND');

    // Assert
    await expect(invalidCommandPromise).rejects.toMatchSnapshot();
  });
});
