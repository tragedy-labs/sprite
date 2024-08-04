import { SpriteDatabase } from './database/SpriteDatabase.js';
import { Session } from './session/Session.js';

const session = new Session({
  username: 'root',
  password: 'playwithdata',
  address: 'http://localhost:2480'
});

const db = new SpriteDatabase({
  databaseName: 'SpriteIntegrationTesting',
  session
});

db.explain('SELECT from schema:indexes').then(console.log);
