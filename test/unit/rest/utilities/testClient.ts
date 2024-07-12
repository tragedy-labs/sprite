import { SpriteRestClient } from '../../../../src/SpriteRestClient.js';
import { variables } from '../../../variables.js';

export const client = new SpriteRestClient({
  address: variables.address,
  username: variables.username,
  password: variables.password
});
