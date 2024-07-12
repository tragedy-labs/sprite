import { client } from './testClient.js';
import { GraphModality } from '../../../../src/modes/GraphModality.js';

describe('SpriteDatabase.graph()', () => {
  it(`should return an instance of GraphModality`, async () => {
    expect(client.graphModality()).toBeInstanceOf(GraphModality);
  });
});
