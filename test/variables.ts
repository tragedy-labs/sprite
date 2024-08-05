import { DatabaseSession } from '@/session/DatabaseSession.js';
import { ServerSession } from '@/session/ServerSession.js';
import { SpriteTransaction } from '@/transaction/SpriteTransaction.js';
import { config } from 'dotenv';
config();

/**
 * Contains all the variables that used for testing
 */
export const variables = {
  databaseName: 'SpriteIntegrationTesting',
  user: 'Test',
  username: process.env.SPRITE_ARCADE_TEST_DB_USERNAME || 'root',
  password: process.env.SPRITE_ARCADE_TEST_DB_PASSWORD || 'playwithdata',
  address: process.env.SPRITE_ARCADE_TEST_DB_ADDRESS || 'http://localhost:2480',
  apiRoute: '/api/v1/',
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

export const CREATE_USER_PARAMS = {
  // ArcadeDB expects 'name' to be a property
  // Sprite uses 'username' as a convention
  // this is why there is a difference between
  // input and what the method sends to the server
  username: variables.username,
  password: variables.password,
  databases: {
    myDatabase: 'user'
  }
};

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

export const TestDatabaseSession = new DatabaseSession({
  username: variables.username,
  password: variables.password,
  address: variables.address,
  databaseName: variables.databaseName
});

export const TestServerSession = new ServerSession({
  username: variables.username,
  password: variables.password,
  address: variables.address
});

export const testTransaction = new SpriteTransaction(
  TestDatabaseSession,
  variables.sessionId
);
