import { AsArcadeDocuments } from 'src/api.js';
import { testClient } from './testclient.js';
import { CreateDocumentType, DropType } from 'src/types/commands.js';
import { ArcadeDocument } from 'src/types/queries.js';

const typeName = 'SelectFromTestType';

interface SelectFromTestType {
  aProperty: string;
}

interface DocumentTypes {
  [typeName]: SelectFromTestType;
}

const data: SelectFromTestType = {
  aProperty: 'aValue'
};

const db = testClient.database;

describe('SqlDialect.selectFrom()', () => {
  beforeAll(async () => {
    await db.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    await db.command<DropType<typeof typeName>>('sql', `DROP TYPE ${typeName}`);
  });
  it(`should select record`, async () => {
    /* Arrange */

    await db.command(
      'sql',
      `INSERT INTO ${typeName} CONTENT ${JSON.stringify([data, data])}`
    );

    /* Act */
    const records = await testClient.selectFrom<
      AsArcadeDocuments<DocumentTypes>,
      typeof typeName,
      'aProperty'
    >(typeName, {
      where: ['aProperty', '==', 'aValue']
    });

    /* Assert */
    records.forEach((record: ArcadeDocument<SelectFromTestType>) => {
      expect(record).toHaveProperty('@rid'); // Ensure each record has the '@rid' property
      expect(record['@type']).toBe(typeName); // Ensure each record has the '@type' property
      expect(record).toHaveProperty('aProperty'); // Ensure each record has the 'name' property
      expect(record.aProperty).toBe('aValue'); // Ensure 'aProperty' is 'aValue'
    });
  });

  it(`should propagate errors from the database`, async () => {
    /* Arrange, Act, & Assert */
    await expect(
      // @ts-expect-error - intentionally passing invalid type
      testClient.selectFrom('INVALID_TYPE_NAME')
    ).rejects.toMatchSnapshot();
  });
});
