import { SpriteDatabase } from './database/SpriteDatabase.js';
import { Session } from './session/Session.js';

const session = new Session({
  username: 'admin',
  password: 'admin',
  address: 'http://localhost:2480'
});

const db = new SpriteDatabase({
  databaseName: 'test',
  session
});

db.transaction(async (tx) => {
  await tx
    .crud('sql', `INSERT INTO IClass SET name = :name`, { name: 'jim' })
    .then(console.log);
});
