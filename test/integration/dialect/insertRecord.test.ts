import { CreateDocumentType, DropType } from 'src/types/commands.js';
import { RID_REGEX } from '../regex.js';
import { testClient as dialect } from './testclient.js';

const invalidTypeName = 'INVALID_TYPE_NAME';
const typeName = 'InsertRecordTestType';
const db = dialect.database;

type InsertRecordTestType = {
  aProperty: string;
};

interface DocumentTypes {
  [typeName]: InsertRecordTestType;
}

const data: InsertRecordTestType = {
  aProperty: 'aValue'
};

describe('SqlDialect.insertRecord()', () => {
  beforeAll(async () => {
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    await db.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it(`should insert a record`, async () => {
    /* Arrange */
    const trx = await db.newTransaction();

    /* Act */
    const [doc] = await dialect.insertRecord<DocumentTypes, typeof typeName>(
      typeName,
      trx,
      {
        data
      }
    );

    // undo insert
    trx.rollback();

    /* Assert */
    expect(doc['@rid']).toMatch(RID_REGEX);
    expect(doc['@cat']).toBe('d');
    expect(doc['@type']).toBe(typeName);
    expect(doc.aProperty).toBe(data.aProperty);
  });

  it(`should propagate errors from from the database`, async () => {
    /* Arange */
    const trx = await db.newTransaction();

    /* Act & Assert */
    await expect(
      dialect.insertRecord<
        DocumentTypes,
        // @ts-expect-error - intentionally passing invalid type
        typeof invalidTypeName
      >(invalidTypeName, trx, {
        data
      })
    ).rejects.toMatchSnapshot();

    // undo insert
    trx.rollback();
  });
});
