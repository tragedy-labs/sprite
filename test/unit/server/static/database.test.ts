// Lib
import { Server } from '@/server/Server.js';
import { SpriteDatabase } from '@/database/SpriteDatabase.js';

// Testing
import { TestServerSession as SESSION, variables } from '@test/variables.js';

describe('Server.database()', () => {
  it('should return an instance of SpriteDatabase', async () => {
    const database = Server.database(SESSION, variables.databaseName);
    // Assert
    expect(database).toBeInstanceOf(SpriteDatabase);
  });
});
