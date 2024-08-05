import { CREATE_DATABASE } from '@/server/commands/CREATE_DATABASE.js';
import { variables } from '@test/variables.js';

describe('CREATE_DATABASE', () => {
  it('given a databaseName (string) as an argument should return a string that is the command to create that database', async () => {
    // Arrange
    const expected = `CREATE DATABASE ${variables.databaseName}`;
    // Act
    const result = CREATE_DATABASE(variables.databaseName);
    // Assert
    expect(result).toEqual(expected);
  });
});
