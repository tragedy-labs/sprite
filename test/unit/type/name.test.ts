import { client } from './testClient.js';

describe('SpriteType.name', () => {
  it('should return the name when the .name accessor is used', async () => {
    expect(client.name).toBe('aDocument');
  });
});
