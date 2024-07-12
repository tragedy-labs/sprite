import { client } from './testClient.js';
import { DocumentModality } from '../../../../src/modes/DocumentModality.js';

describe('SpriteDatabase.documents()', () => {
  it(`should return an instance of DocumentModality`, async () => {
    expect(client.documentModality()).toBeInstanceOf(DocumentModality);
  });
});
