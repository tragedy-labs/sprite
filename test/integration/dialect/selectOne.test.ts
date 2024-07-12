import { ArcadeDocument } from 'src/types/queries.js';
import { AsArcadeDocuments } from 'src/types/database.js';
import { testClient } from './testclient.js';
import { CreateDocumentType, DropType } from 'src/types/commands.js';

const db = testClient.database;
const typeName = 'SelectOneTestType';
const invalidTypeName = 'SELECT_ONE_INVALID_TYPE';

interface SelectOneTestType {
  name: string;
}

interface DocumentTypes {
  [typeName]: SelectOneTestType;
  [invalidTypeName]: object;
}

describe('SqlDialect.selectOne()', () => {
  beforeAll(async () => {
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    await db.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it(`should select a record`, async () => {
    /* Arrange */
    const insertTrx = await db.newTransaction();
    await db.command<ArcadeDocument<SelectOneTestType>>(
      'sql',
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify({ name: 'aValue' })}`,
      insertTrx
    );
    await insertTrx.commit();

    const [queryResult] = await db.query<ArcadeDocument<SelectOneTestType>>(
      'sql',
      `SELECT * FROM ${typeName} LIMIT 1`
    );

    /* Act */
    const selectOneResult = await testClient.selectOne<
      AsArcadeDocuments<DocumentTypes>,
      typeof typeName
    >(queryResult['@rid']);

    /* Assert */
    await expect(queryResult).toEqual(selectOneResult);
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange, Act & Assert */
    await expect(
      testClient.selectOne<DocumentTypes, typeof invalidTypeName>(
        invalidTypeName
      )
    ).rejects.toMatchSnapshot();
  });
});
