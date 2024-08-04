// Lib
import { Database } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.getSchema()', () => {
  it('should call the Databasec() method with the given command, and the unique session instance', async () => {
    // Arrange
    jest.spyOn(Database, 'getSchema').mockImplementationOnce(async () => null);
    // Act
    await SpriteDatabase.getSchema();
    // Asserts
    expect(Database.getSchema).toHaveBeenCalledWith(SESSION);
  });

  it('should return the output of the Database.getSchema() method', async () => {
    // Arrange
    jest
      .spyOn(Database, 'getSchema')
      .mockImplementationOnce(async () => variables.nonEmptyString);
    // Act
    const result = await SpriteDatabase.getSchema();
    // Asserts
    expect(result).toBe(variables.nonEmptyString);
  });
});
