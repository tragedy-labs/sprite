import { testClient } from './testclient.js';
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from 'src/types/commands.js';

interface DeleteFromTestDocument {
  aProperty: string;
}

interface DocumentTypes {
  DeleteFromTestDocument: DeleteFromTestDocument;
}

const data: DeleteFromTestDocument = {
  aProperty: 'aValue'
};

const db = testClient.database;
const typeName = 'DeleteFromTestDocument';

describe('SqlDialect.deleteFrom()', () => {
  beforeAll(async () => {
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    await db.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it(`should delete a record`, async () => {
    /* Arrange */
    // Create a record to delete
    const trxCreate = await db.newTransaction();
    const [record] = await db.command<InsertDocument<DeleteFromTestDocument>>(
      'sql',
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify(data)}`
    );
    await trxCreate.commit();

    /* Act */
    const trxDelete = await db.newTransaction();
    await testClient.deleteFrom<DocumentTypes, typeof typeName, '@rid'>(
      typeName,
      trxDelete,
      {
        where: ['@rid', '==', record['@rid']]
      }
    );
    await trxDelete.commit();

    /* Assert */
    await expect(
      db.query(
        'sql',
        `SELECT * FROM ${typeName} WHERE @rid == ${record['@rid']}`
      )
    ).resolves.toHaveLength(0);
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange */
    const trx = await db.newTransaction();
    /* Act & Assert */
    await expect(
      // @ts-expect-error - intentionally passing invalid type
      testClient.deleteFrom('INVALID_TYPE', trx, {
        where: ['@rid', '==', 'invalid']
      })
    ).rejects.toMatchSnapshot();

    trx.rollback();
  });
});
