import { SpriteDatabase } from '../../../src/SpriteDatabase.js';
import { variables } from '../variables.js';

export const testClient = new SpriteDatabase({
  username: variables.username,
  password: variables.password,
  address: variables.address,
  databaseName: variables.databaseName
});
