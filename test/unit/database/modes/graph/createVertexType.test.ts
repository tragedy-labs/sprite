import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { CreateVertexType } from '@/types/commands.js';

const typeName = 'aVertex';

describe('GraphModality.createVertexType()', () => {
  it(`correctly passes all options to SpriteOperations._createType`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async (): Promise<CreateVertexType<typeof typeName>> => {
          return [{ typeName, operation: 'create vertex type' }];
        }
      );

    // Act
    await client.createVertexType(typeName, {
      buckets: [variables.bucketName, variables.bucketName],
      totalBuckets: 2,
      extends: 'anotherVertex',
      ifNotExists: true
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `CREATE vertex TYPE ${typeName} IF NOT EXISTS EXTENDS anotherVertex BUCKET ${variables.bucketName},${variables.bucketName} BUCKETS 2`
    );
  });
});
