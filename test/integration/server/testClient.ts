// Lib
import { SpriteServer } from '@/server/SpriteServer.js';

// Testing
import { variables } from '@test/variables.js';

export const testClient = new SpriteServer({
  username: variables.username,
  password: variables.password,
  address: variables.address
});
