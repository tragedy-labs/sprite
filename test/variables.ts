import { config } from 'dotenv';
config();

/**
 * Contains all the variables that used for testing
 */
export const variables = {
  databaseName: 'Test',
  user: 'Test',
  username: process.env.SPRITE_ARCADE_TEST_DB_USERNAME || 'root',
  password: process.env.SPRITE_ARCADE_TEST_DB_PASSWORD || 'playwithdata',
  address: process.env.SPRITE_ARCADE_TEST_DB_ADDRESS || 'http://localhost:2480',
  jsonResponse: { result: 'test' },
  jsonResponseArray: { result: ['test'] },
  nonEmptyString: 'non-empty string',
  sessionId: 'AS-0000000-0000-0000-0000-00000000000',
  typeName: 'aType',
  bucketName: 'aBucket',
  rid: '#0:0',
  jsonData: {
    aKey: 'aValue'
  },
  propertyName: 'aProperty',
  indexDescriptor: {
    type: 'aType',
    key: 'aKey',
    value: 'aValue'
  }
} as const;

/**
 * The encoded username and password used for testing.
 */
export const testAuth = Buffer.from(
  `${variables.username}:${variables.password}`
).toString('base64');

export const headers = {
  Authorization: `Basic ${testAuth}`,
  'Content-Type': 'application/json'
};

export const headersWithTransaction = {
  ...headers,
  'arcadedb-session-id': variables.sessionId
};
