// Lib
import { ArcadeDocument } from '@/types/queries.js';
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from '@/types/commands.js';
import { RID_REGEX } from '@/validation/regex/RID.js';

// Lib
import { testClient } from '@test/integration/database/testClient.js';

interface TrxClassRollbackTestType {
  aProperty: string;
}

const typeName = 'TrxClassRollbackTestType';

describe('Database.rollbackTransaction', () => {
  beforeAll(async () => {
    // Create a record type for the test
    await testClient.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName} IF NOT EXISTS`
    );
  });
  afterAll(async () => {
    // Drop the test record type
    const [thing] = await testClient.command<DropType<typeof typeName>>(
      'sql',
      `DROP TYPE ${typeName} IF EXISTS`
    );
  });
  it('rollsback the transaction', async () => {
    const transaction = await testClient.newTransaction();

    // Insert a new document within the transaction
    const [createdRecord] = await transaction.crud<
      InsertDocument<TrxClassRollbackTestType>
    >('sql', `INSERT INTO ${typeName}`);

    // Rollback the transaction
    const didRollBack = await transaction.rollback();

    // Query to check if the document exists after the rollback
    const [queriedRecordAfterRollback] = await testClient.query<
      ArcadeDocument<TrxClassRollbackTestType>
    >(
      'sql',
      `SELECT FROM ${createdRecord['@type']} WHERE @rid = ${createdRecord['@rid']}`
    );

    // Assertions
    expect(createdRecord['@rid']).toMatch(RID_REGEX);
    expect(queriedRecordAfterRollback).toBe(undefined);
    expect(didRollBack).toBe(true);
    await expect(transaction.commit()).rejects.toThrow();
  });
});
