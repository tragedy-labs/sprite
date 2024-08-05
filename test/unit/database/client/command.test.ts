// Lib
import { Database, Dialect } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.command()', () => {
  it('should call the Database.command() method with the given command, and the unique session instance', async () => {
    // Arrange
    jest.spyOn(Database, 'command').mockImplementationOnce(async () => null);
    const PARAMS = {
      test: 'param'
    };

    // Act
    await SpriteDatabase.command(Dialect.SQL, variables.nonEmptyString, PARAMS);
    // Asserts
    expect(Database.command).toHaveBeenCalledWith(
      SESSION,
      Dialect.SQL,
      variables.nonEmptyString,
      PARAMS
    );
  });

  it('should return the output of the Database.command() method', async () => {
    // Arrange
    jest.spyOn(Database, 'command').mockImplementationOnce(async () => 'test');
    // Act
    const result = await SpriteDatabase.command(
      Dialect.SQL,
      variables.nonEmptyString,
      {
        test: 'param'
      }
    );
    // Asserts
    expect(result).toBe('test');
  });
});
