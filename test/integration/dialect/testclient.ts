import { SqlDialect } from '../../../src/dialects/SqlDialect.js';
import { testClient as spriteDatabaseInstance } from '../database/testClient.js';

export const testClient = new SqlDialect(spriteDatabaseInstance);
