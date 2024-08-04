import { DatabaseSession } from '@/session/DatabaseSession.js';
import { SpriteDatabase } from './SpriteDatabase.js';
import { Dialect } from './Database.js';

const client = new SpriteDatabase({
  username: 'admin',
  password: '',
  address: 'localhost',
  databaseName: 'test'
});

client.command('sql', 'SELECT FROM schema:types');
