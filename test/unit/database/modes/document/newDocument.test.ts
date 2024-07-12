import { client, dbClient as SpriteDatabase } from './testClient.js';
import { variables } from '../../../../variables.js';
import { ArcadeCommandResponse } from '../../../../../src/types/database.js';
import { testTransaction } from '../../client/testClient.js';

const typeName = 'aDocument';

const newDocument = {
  '@rid': variables.rid,
  '@cat': 'v',
  '@type': typeName,
  aProperty: 'aValue'
};

const newDocumentCommandResponse = {
  user: variables.username,
  serverName: '',
  version: '',
  result: [newDocument]
};

describe('DocumentModality.newDocument()', () => {
  // Arrange
  beforeEach(() => {
    jest
      .spyOn(SpriteDatabase, 'command')
      .mockImplementationOnce(
        async (): Promise<ArcadeCommandResponse<unknown>> =>
          newDocumentCommandResponse
      );
  });
  it(`correctly passes typeName, options.data, and options.transactionId to SpriteOperations._insertRecord`, async () => {
    // Act
    await client.newDocument(typeName, testTransaction, {
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
    await client.newDocument(typeName, testTransaction, {
      bucket: variables.bucketName
    });

    // Asserts
    expect(SpriteDatabase.command).toHaveBeenCalledWith(
      `sql`,
      `INSERT INTO BUCKET:${variables.bucketName}`,
      testTransaction
    );
  });
});
