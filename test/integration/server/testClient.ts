import { SpriteServer } from '../../../src/SpriteServer.js';
import { variables } from '../variables.js';

export const testClient = new SpriteServer({
  username: variables.username,
  password: variables.password,
  address: variables.address
});
