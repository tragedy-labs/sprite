import { OPEN_DATABASE } from '@/server/commands/OPEN_DATABASE.js';
import { variables } from '@test/variables.js';

describe('OPEN_DATABASE', () => {
  it('given a datbaseName (string) it should return the string command to open the database', () => {
    // Arrange
    const expected = `open database ${variables.databaseName}`;
    // Act
    const result = OPEN_DATABASE(variables.databaseName);
    // Assert
    expect(result).toStrictEqual(expected);
  });
});
