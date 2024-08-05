// Lib
import { Database } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';
import { ArcadeSqlExplanation } from '@/types/database.js';

describe('SpriteDatabase.explain()', () => {
  it('should call the Databasec() method with the given command, and the unique session instance', async () => {
    // Arrange
    jest
      .spyOn(Database, 'explain')
      .mockImplementationOnce(
        async () => ({}) as unknown as ArcadeSqlExplanation
      );
    // Act
    await SpriteDatabase.explain(variables.nonEmptyString);
    // Asserts
    expect(Database.explain).toHaveBeenCalledWith(
      SESSION,
      variables.nonEmptyString
    );
  });

  it('should return the output of the Database.explain() method', async () => {
    // Arrange
    jest
      .spyOn(Database, 'explain')
      .mockImplementationOnce(
        async () => 'test' as unknown as ArcadeSqlExplanation
      );
    // Act
    const result = await SpriteDatabase.explain(variables.nonEmptyString);
    // Asserts
    expect(result).toBe('test');
  });
});
