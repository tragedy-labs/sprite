import { variables } from '../../../variables.js';
import { client } from './testClient.js';

describe('SpriteDatabase.name accessor', () => {
  it(`should return the database name`, async () => {
    expect(client.name).toBe(variables.databaseName);
  });
});
