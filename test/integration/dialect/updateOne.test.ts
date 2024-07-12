import { testClient } from './testclient.js';
import { ArcadeDocument } from 'src/types/queries.js';
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from 'src/types/commands.js';

const db = testClient.database;
const typeName = 'UpdateOneTestType';

interface UpdateOneTestType {
  aProperty: string;
}

interface VertexTable {
  [typeName]: UpdateOneTestType;
}

const originalData: UpdateOneTestType = {
  aProperty: 'aValue'
};

const updatedData: UpdateOneTestType = {
  aProperty: 'bValue'
};

describe('SqlDialect.updateOne()', () => {
  beforeAll(async () => {
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    await db.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it(`should update a record`, async () => {
    /* Arrange */
    const trxCreate = await db.newTransaction();
    const [originalRecord] = await db.command<
      InsertDocument<UpdateOneTestType>
    >(
      'sql',
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify(originalData)}`,
      trxCreate
    );
    await trxCreate.commit();

    /* Act */
    const trxUpdate = await db.newTransaction();
    await testClient.updateOne<VertexTable, typeof typeName>(
      originalRecord['@rid'],
      updatedData,
      trxUpdate
    );
    await trxUpdate.commit();

    const [updatedRecord] = await db.query<ArcadeDocument<UpdateOneTestType>>(
      'sql',
      `SELECT * FROM ${typeName} WHERE @rid == ${originalRecord['@rid']}`
    );

    /* Assert */
    expect(updatedRecord.aProperty).toEqual('bValue');
    expect(updatedRecord.aProperty).not.toEqual(originalRecord.aProperty);
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange */
    const trxError = await db.newTransaction();

    /* Act & Assert */
    await expect(
      testClient.updateOne('INVALID_RID', {}, trxError)
    ).rejects.toMatchSnapshot();

    await trxError.rollback();
  });
});
