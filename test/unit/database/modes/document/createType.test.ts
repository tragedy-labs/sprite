import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { CreateDocumentType } from '@/types/commands.js';

const typeName = 'aDocument';

describe('DocumentModality.createType()', () => {
  it(`correctly passes all options to TypedOperations._createType`, async () => {
    // Arrange
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async (): Promise<CreateDocumentType<typeof typeName>> => {
          return [{ typeName, operation: 'create document type' }];
        }
      );

    // Act
    await client.createType(typeName, {
      buckets: [variables.bucketName, variables.bucketName],
      totalBuckets: 2,
      extends: 'anotherDocument',
      ifNotExists: true
    });

    // Assert
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `CREATE document TYPE ${typeName} IF NOT EXISTS EXTENDS anotherDocument BUCKET ${variables.bucketName},${variables.bucketName} BUCKETS 2`
    );
  });
});
