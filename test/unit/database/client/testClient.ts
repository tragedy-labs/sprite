import { variables } from '@test/variables.js';
import { SpriteDatabase } from '@/database/SpriteDatabase.js';

export const SPRITE_DATABASE = new SpriteDatabase({
  username: process.env.ARCADE_TEST_DB_USERNAME || variables.username,
  password: process.env.ARCADE_TEST_DB_PASSWORD || variables.password,
  address: process.env.ARCADE_TEST_DB_ADDRESS || variables.address,
  databaseName: process.env.ARCADE_TEST_DB_NAME || variables.databaseName
});

// export const testTransaction = new SpriteTransaction(
//   client,
//   variables.sessionId
// );
