// Lib
import { Server } from '@/server/Server.js';

// Testing
import {
  SPRITE_DATABASE,
  SPRITE_DATABASE as SpriteDatabase
} from './testClient.js';
import { TestDatabaseSession as SESSION, variables } from '@test/variables.js';

describe('SpriteDatabase.create()', () => {
  it('should call the Server.createDatabase() method with the unique session instance, and the name of the database in the session', async () => {
    // Arrange
    jest
      .spyOn(Server, 'createDatabase')
      .mockImplementationOnce(async () => SPRITE_DATABASE);

    // Act
    await SpriteDatabase.create();
    // Asserts
    expect(Server.createDatabase).toHaveBeenCalledWith(
      SESSION,
      variables.databaseName
    );
  });

  it('should return the output of the Database.create() method', async () => {
    // Arrange
    jest
      .spyOn(Server, 'createDatabase')
      .mockImplementationOnce(async () => SPRITE_DATABASE);
    // Act
    const result = await SpriteDatabase.create();
    // Asserts
    expect(result).toBe(SPRITE_DATABASE);
  });
});
