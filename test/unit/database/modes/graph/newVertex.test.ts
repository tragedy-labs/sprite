import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { testTransaction } from '../../client/testClient.js';

const typeName = 'aVertex';

const newVertexResult = [
  {
    '@rid': variables.rid,
    '@cat': 'v',
    '@type': typeName,
    aProperty: 'aValue'
  }
];

describe('GraphModality.newVertex()', () => {
  // Arrange
  beforeEach(() => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async (): Promise<unknown> => newVertexResult);
  });
  it(`correctly passes typeName, options.data, and options.transactionId to SpriteOperations._insertRecord`, async () => {
    // Act
    await client.newVertex(typeName, testTransaction, {
      data: {
        aProperty: 'aValue'
      }
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify({
        aProperty: 'aValue'
      })}`,
      testTransaction
    );
  });
  it(`correctly passes handles options.bucket`, async () => {
    // Act
    await client.newVertex(typeName, testTransaction, {
      bucket: variables.bucketName
    });

    // Asserts
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `INSERT INTO BUCKET:${variables.bucketName}`,
      testTransaction
    );
  });

  it('should return the newly created vertex', async () => {
    // Act
    const [record] = await client.newVertex(typeName, testTransaction, {
      data: {
        aProperty: 'aValue'
      }
    });

    // Assert
    expect(record).toMatchObject(newVertexResult[0]);
  });
});
