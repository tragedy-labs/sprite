import { DROP_DATABASE } from '@/server/commands/DROP_DATABASE.js';
import { variables } from '@test/variables.js';

describe('DROP_DATABASE', () => {
  it('given a databaseName (string) as an argument should return a string that is the command to drop that database', async () => {
    // Arrange
    const expected = `drop database ${variables.databaseName}`;
    // Act
    const result = DROP_DATABASE(variables.databaseName);
    // Assert
    expect(result).toEqual(expected);
  });
});
