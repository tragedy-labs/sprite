// Lib
import { Database } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import {
  TestDatabaseSession as SESSION,
  testTransaction as TRX
} from '@test/variables.js';

describe('SpriteDatabase.beginTransaction()', () => {
  // Arrange
  beforeEach(() => {
    jest
      .spyOn(Database, 'beginTransaction')
      .mockImplementationOnce(async () => TRX);
  });
  it('should call the Database.newTransaction() with the unique session instance', async () => {
    // Act
    await SpriteDatabase.newTransaction();
    // Assert
    // NOTE: `undefined` because isolation level is always forwarded to the static function
    expect(Database.beginTransaction).toHaveBeenCalledWith(SESSION, undefined);
  });

  it('should call the Database.newTransaction() with READ_COMMITED if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.newTransaction('READ_COMMITTED');
    // Assert
    expect(Database.beginTransaction).toHaveBeenCalledWith(
      SESSION,
      'READ_COMMITTED'
    );
  });

  it('should call the Database.newTransaction() with REPEATABLE_READ if supplied as an argument', async () => {
    // Act
    await SpriteDatabase.newTransaction('REPEATABLE_READ');
    // Assert
    expect(Database.beginTransaction).toHaveBeenCalledWith(
      SESSION,
      'REPEATABLE_READ'
    );
  });

  it('should return the output of the Database.beginTransaction() method', async () => {
    // Act
    const result = await SpriteDatabase.newTransaction();
    // Asserts
    expect(result).toBe(TRX);
  });
});
