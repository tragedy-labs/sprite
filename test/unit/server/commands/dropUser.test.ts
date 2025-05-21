import { DROP_USER } from '@/server/commands/DROP_USER.js';
import { variables } from '@test/variables.js';

describe('DROP_USER', () => {
  it('given a username (string) as an argument should return a string that is the command to drop that user', async () => {
    // Arrange
    const expected = `drop user ${variables.username}`;
    // Act
    const result = DROP_USER(variables.username);
    // Assert
    expect(result).toEqual(expected);
  });
});
