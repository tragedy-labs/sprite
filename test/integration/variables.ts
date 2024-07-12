export const variables = {
  databaseName: 'SpriteIntegrationTesting',
  address:
    process.env.SPRITE_ARCADE_TEST_DB_USERNAME || 'http:///localhost:2480',
  username: process.env.SPRITE_ARCADE_TEST_DB_USERNAME || 'root',
  password: process.env.SPRITE_ARCADE_TEST_DB_USERNAME || 'playwithdata',
  documentType: 'ORIDs',
  newDatabaseName: 'SpriteCreateDatabaseTestDatabase',
  newUsername: 'newUser',
  newPassword: 'newPassword',
  rid: '#0:0'
} as const;
