// Lib
import { Database } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.exists()', () => {
  it('should call the Database.exists() method with the unique session instance, and the name of the database in the session', async () => {
    // Arrange
    jest.spyOn(Database, 'exists').mockImplementationOnce(async () => true);
    // Act
    await SpriteDatabase.exists();
    // Asserts
    expect(Database.exists).toHaveBeenCalledWith(
      SESSION,
      variables.databaseName
    );
  });

  it('should return the output of the Database.exists() method', async () => {
    // Arrange
    jest.spyOn(Database, 'exists').mockImplementationOnce(async () => true);
    // Act
    const result = await SpriteDatabase.exists();
    // Asserts
    expect(result).toBe(true);
  });
});
