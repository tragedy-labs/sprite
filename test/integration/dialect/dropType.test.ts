import { CreateDocumentType } from 'src/types/commands.js';
import { testClient } from './testclient.js';
import { ArcadeDocument } from 'src/types/queries.js';

const db = testClient.database;
const invalidTypeName = 'DROP_TYPE_INVALID_TYPE';
const typeName = 'DropTypeTestType';

type DropTypeTestType = {
  aProperty: string;
};

interface DocumentTypes {
  [typeName]: DropTypeTestType;
  [invalidTypeName]: object;
}

describe('SqlDialect.dropType()', () => {
  it(`should drop a type`, async () => {
    /* Arrange */
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );

    /* Act & Assert */
    await expect(
      db.query<ArcadeDocument<DropTypeTestType>>(
        'sql',
        `SELECT FROM ${typeName}`
      )
    ).resolves.toHaveLength(0);

    await testClient.dropType<DocumentTypes, typeof typeName>(typeName);

    /* Assert */
    await expect(
      db.query<ArcadeDocument<DropTypeTestType>>(
        'sql',
        `SELECT FROM ${typeName}`
      )
    ).rejects.toMatchSnapshot();
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange, Act & Assert */
    await expect(
      testClient.dropType<DocumentTypes, typeof invalidTypeName>(
        invalidTypeName
      )
    ).rejects.toMatchSnapshot();
  });
});
