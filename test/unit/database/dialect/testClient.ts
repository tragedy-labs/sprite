import { SqlDialect } from '../../../../src/dialects/SqlDialect.js';
import { client as dbClient } from '../client/testClient.js';

export const client = new SqlDialect(dbClient);
