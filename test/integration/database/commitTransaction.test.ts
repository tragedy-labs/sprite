import {
  CreateDocumentType,
  DropType,
  InsertDocument
} from '@/types/commands.js';
import { ArcadeDocument } from '@/types/queries.js';

import { testClient } from './testClient.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { RID_REGEX } from '@/validation/regex/RID.js';
import { Database } from '@/database/Database.js';
import { TestDatabaseSession as SESSION } from '@test/variables.js';

interface TrxCommitTestType {
  aValue: string;
}
const typeName = 'TrxCommitTestType';

describe('SpriteDatabase.commitTransaction', () => {
  let transaction: SpriteTransaction;

  beforeAll(async () => {
    // Create a new document type before the suite executes
    await testClient.command<CreateDocumentType<typeof typeName>>(
      'sql',
      `CREATE document TYPE ${typeName} IF NOT EXISTS`
    );
  });

  beforeEach(async () => {
    // Setup a new transaction before each test
    transaction = await testClient.newTransaction();
  });

  afterAll(async () => {
    // Drop the test record type
    await testClient.command<DropType<typeof typeName>>(
      'sql',
      `DROP TYPE ${typeName} IF EXISTS`
    );
  });

  it('commits a transaction successfully', async () => {
    // Insert a new document within the transaction
    const [createdRecord] = await transaction.crud<
      InsertDocument<TrxCommitTestType>
    >('sql', `INSERT INTO ${typeName}`);

    // Query to check if the document exists before the commit
    const [queriedBeforeCommit] = await testClient.query<
      ArcadeDocument<TrxCommitTestType>
    >(
      'sql',
      `SELECT FROM ${createdRecord['@type']} WHERE @rid = ${createdRecord['@rid']}`
    );

    // Commit the transaction
    await Database.commitTransaction(SESSION, transaction);

    // Query to check if the document exists after the commit
    const [queriedRecordAfterCommit] = await testClient.query<
      ArcadeDocument<TrxCommitTestType>
    >(
      'sql',
      `SELECT FROM ${createdRecord['@type']} WHERE @rid = ${createdRecord['@rid']}`
    );

    // delete added record for consistancy

    await transaction.crud(
      'sql',
      `DELETE FROM ${createdRecord['@type']} WHERE @rid == ${createdRecord['@rid']}`
    );

    // Assertions
    // The record should not be found before the commit
    expect(queriedBeforeCommit).toBe(undefined);

    // The @rid of the created record should be a string
    expect(typeof createdRecord['@rid']).toBe('string');

    // The @rid of the created record after commit should match the pattern
    expect(createdRecord['@rid']).toMatch(RID_REGEX);

    // The @rid of the queried record after commit should match the pattern
    expect(queriedRecordAfterCommit['@rid']).toMatch(RID_REGEX);

    // The @rid of the created record should match the @rid of the queried record after commit
    expect(queriedRecordAfterCommit['@rid']).toEqual(createdRecord['@rid']);
  });
});
