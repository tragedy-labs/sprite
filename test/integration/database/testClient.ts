// Lib
import { SpriteDatabase } from '@/database/SpriteDatabase.js';

// Testing
import { variables } from '@test/variables.js';

export const testClient = new SpriteDatabase({
  username: variables.username,
  password: variables.password,
  address: variables.address,
  databaseName: 'SpriteIntegrationTesting'
});
