// Lib
import { Transaction } from '@/transaction/Transaction.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.transaction()', () => {
  // Arrange
  beforeEach(() => {
    jest
      .spyOn(Transaction, 'manage')
      .mockImplementationOnce(async () => [true, variables.nonEmptyString]);
  });

  const CALLBACK = async () => {};
  it('should call the Database.transaction() with the unique session instance and callback', async () => {
    // Arrange
    // Act
    await SpriteDatabase.transaction(CALLBACK);
    // Assert
    // NOTE: `undefined` because isolation level is always forwarded to the static function
    expect(Transaction.manage).toHaveBeenCalledWith(
      SESSION,
      CALLBACK,
      undefined
    );
  });

  it('should call the Database.transaction() with READ_COMMITED if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.transaction(CALLBACK, 'READ_COMMITTED');
    // Assert
    expect(Transaction.manage).toHaveBeenCalledWith(
      SESSION,
      CALLBACK,
      'READ_COMMITTED'
    );
  });

  it('should call the Database.transaction() with REPEATABLE_READ if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.transaction(CALLBACK, 'REPEATABLE_READ');
    // Assert
    expect(Transaction.manage).toHaveBeenCalledWith(
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
