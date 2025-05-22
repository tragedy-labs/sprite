// Lib
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from '@/types/commands.js';
import { TestDatabaseSession as SESSION } from '@test/variables.js';
import { ArcadeDocument } from '@/types/queries.js';
import { RID_REGEX } from '@/validation/regex/RID.js';

// Testing
import { testClient } from './testClient.js';
import { Transaction } from '@/transaction/Transaction.js';

interface RollbackTrxTextType {
  aProperty: string;
}

const typeName = 'RollbackTrxTestType';

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
    await testClient.command<DropType<typeof typeName>>(
      'sql',
      `DROP TYPE ${typeName} IF EXISTS`
    );
  });
  it('rollsback the transaction', async () => {
    const transaction = await testClient.newTransaction();

    // Insert a new document within the transaction
    const [createdRecord] = await transaction.crud<
      InsertDocument<RollbackTrxTextType>
    >('sql', `INSERT INTO ${typeName}`);

    // Rollback the transaction
    const didRollBack = await Transaction.rollback(SESSION, transaction);

    // Query to check if the document exists after the rollback
    const [queriedRecordAfterRollback] = await testClient.query<
      ArcadeDocument<RollbackTrxTextType>
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
