import { RID_REGEX } from '../regex.js';
import { testClient } from './testclient.js';
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from 'src/types/commands.js';

interface DeleteOneTestType {
  aProperty: string;
}

const data: DeleteOneTestType = {
  aProperty: 'aValue'
};

const db = testClient.database;
const typeName = 'DeleteOneTestType';

describe('SqlDialect.deleteOne()', () => {
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
    const createTrx = await db.newTransaction();
    const [record] = await db.command<InsertDocument<DeleteOneTestType>>(
      'sql',
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify(data)}`,
      createTrx
    );
    await createTrx.commit();

    /* Act */
    const deleteTrx = await db.newTransaction();
    await testClient.deleteOne(record['@rid'], deleteTrx);
    await deleteTrx.commit();

    /* Assert */

    // Validate created record
    await expect(record['@rid']).toMatch(RID_REGEX);
    await expect(record['@type']).toMatch(typeName);

    // Validate record was deleted
    await expect(
      db.query(
        'sql',
        `SELECT * FROM ${record['@type']} WHERE @rid == ${record['@rid']}`
      )
    ).resolves.toHaveLength(0);
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange & Act */
    const trx = await db.newTransaction();
    /* Assert */
    await expect(
      testClient.deleteOne('INVALID_RID', trx)
    ).rejects.toMatchSnapshot();
  });
});
