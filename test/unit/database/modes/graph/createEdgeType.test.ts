import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { CreateEdgeType } from '@/types/commands.js';

const typeName = 'anEdge';

describe('GraphModality.createEdgeType()', () => {
  it(`correctly passes all options to SpriteOperations._createType`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(async (): Promise<CreateEdgeType> => {
        return [{ typeName, operation: 'create edge type' }];
      });

    // Act
    await client.createEdgeType(typeName, {
      buckets: [variables.bucketName, variables.bucketName],
      totalBuckets: 2,
      extends: 'anotherEdge',
      ifNotExists: true
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `CREATE edge TYPE ${typeName} IF NOT EXISTS EXTENDS anotherEdge BUCKET ${variables.bucketName},${variables.bucketName} BUCKETS 2`
    );
  });
});
