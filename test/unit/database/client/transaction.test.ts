// Lib
import { Database } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.transaction()', () => {
  // Arrange
  beforeEach(() => {
    jest
      .spyOn(Database, 'transaction')
      .mockImplementationOnce(async () => [true, variables.nonEmptyString]);
  });

  const CALLBACK = async () => {};
  it('should call the Database.transaction() with the unique session instance and callback', async () => {
    // Arrange
    // Act
    await SpriteDatabase.transaction(CALLBACK);
    // Assert
    // NOTE: `undefined` because isolation level is always forwarded to the static function
    expect(Database.transaction).toHaveBeenCalledWith(
      SESSION,
      CALLBACK,
      undefined
    );
  });

  it('should call the Database.transaction() with READ_COMMITED if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.transaction(CALLBACK, 'READ_COMMITTED');
    // Assert
    expect(Database.transaction).toHaveBeenCalledWith(
      SESSION,
      CALLBACK,
      'READ_COMMITTED'
    );
  });

  it('should call the Database.transaction() with REPEATABLE_READ if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.transaction(CALLBACK, 'REPEATABLE_READ');
    // Assert
    expect(Database.transaction).toHaveBeenCalledWith(
      SESSION,
      CALLBACK,
      'REPEATABLE_READ'
    );
  });

  it('should return the output of the Database.transaction() method', async () => {
    // Act
    const result = await SpriteDatabase.transaction(CALLBACK);
    // Asserts
    expect(result).toEqual([true, variables.nonEmptyString]);
  });
});
