import { variables } from '../../variables.js';
import { SpriteServer } from '../../../src/SpriteServer.js';

export const client = new SpriteServer({
  username: process.env.ARCADE_TEST_DB_USERNAME || variables.username,
  password: process.env.ARCADE_TEST_DB_PASSWORD || variables.password,
  address: process.env.ARCADE_TEST_DB_ADDRESS || variables.address
});
