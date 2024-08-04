// Lib
import { Database, Dialect } from '@/database/Database.js';

// Testing
import { SPRITE_DATABASE as SpriteDatabase } from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.query()', () => {
  it('should call the Database.query() method with the given Dialect, query, parameters, and the unique session instance, a', async () => {
    // Arrange
    jest.spyOn(Database, 'query').mockImplementationOnce(async () => null);

    const PARAMS = {
      test: 'Parameter'
    };

    // Act
    await SpriteDatabase.query(Dialect.SQL, variables.nonEmptyString, PARAMS);
    // Asserts
    expect(Database.query).toHaveBeenCalledWith(
      SESSION,
      Dialect.SQL,
      variables.nonEmptyString,
      PARAMS
    );
  });

  it('should return the output of the Database.query() method', async () => {
    // Arrange
    jest
      .spyOn(Database, 'query')
      .mockImplementationOnce(async () => variables.nonEmptyString);
    // Act
    const result = await SpriteDatabase.query(
      Dialect.SQL,
      variables.nonEmptyString
    );
    // Asserts
    expect(result).toBe(variables.nonEmptyString);
  });
});
