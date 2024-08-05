import { CLOSE_DATABASE } from '@/server/commands/CLOSE_DATABASE.js';
import { variables } from '@test/variables.js';

describe('CLOSE_DATABASE', () => {
  it('given a databaseName (string) as an argument should return a string that is the command to close that database', async () => {
    // Arrange
    const expected = `CLOSE DATABASE ${variables.databaseName}`;
    // Act
    const result = CLOSE_DATABASE(variables.databaseName);
    // Assert
    expect(result).toEqual(expected);
  });
});
