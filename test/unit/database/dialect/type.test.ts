import { client } from './testClient.js';
import { DocumentTypes } from '../../types.js';
import { SpriteType } from '../../../../src/SpriteType.js';

type TypeName = 'aDocument';
const typeName = 'aDocument';

describe('TypedOperations.type()', () => {
  it('should return an instance of SpriteType', async () => {
    // Act
    const type = client.type<DocumentTypes, TypeName>(typeName);
    // Assert
    expect(type).toBeInstanceOf(SpriteType);
  });
});
