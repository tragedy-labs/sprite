import { ArcadeDocument } from 'src/types/queries.js';
import { RID_REGEX } from '../regex.js';
import { testClient } from './testClient.js';
import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from 'src/types/commands.js';

interface RollbackTrxTextType {
  aProperty: string;
}

const typeName = 'RollbackTrxTestType';

describe('SpriteDatabase.rollbackTransaction', () => {
  beforeAll(async () => {
    // Create a record type for the test
    await testClient.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName}`
    );
  });
  afterAll(async () => {
    // Drop the test record type
    await testClient.command<DropType<typeof typeName>>(
      'sql',
      `DROP TYPE ${typeName}`
    );
  });
  it('rollsback the transaction', async () => {
    const transaction = await testClient.newTransaction();

    // Insert a new document within the transaction
    const [createdRecord] = await testClient.command<
      InsertDocument<RollbackTrxTextType>
    >('sql', `INSERT INTO ${typeName}`, transaction);

    // Rollback the transaction
    const didRollBack = await testClient.rollbackTransaction(transaction.id);

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
    await expect(
      testClient.commitTransaction(transaction.id)
    ).rejects.toThrow();
  });
});
