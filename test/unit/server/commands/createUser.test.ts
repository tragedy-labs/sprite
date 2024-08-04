import { CREATE_USER } from '@/server/commands/CREATE_USER.js';
import { CREATE_USER_PARAMS } from '@test/variables.js';

describe('CREATE_USER', () => {
  it('given a username (string) as an argument should return a string that is the command to create that user', async () => {
    // Arrange
    const USER_DETAILS = {
      name: CREATE_USER_PARAMS.username,
      password: CREATE_USER_PARAMS.password,
      databases: CREATE_USER_PARAMS.databases
    };
    const expected = `CREATE USER ${JSON.stringify(USER_DETAILS)}`;
    // Act
    const result = CREATE_USER(USER_DETAILS);
    // Assert
    expect(result).toEqual(expected);
  });
});
