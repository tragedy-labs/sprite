import { CreateDocumentType, SpriteDatabase } from './api.js';

export { SpriteServer } from './server/SpriteServer.js';
export { SpriteDatabase } from './database/SpriteDatabase.js';

export * from './types/index.js';

const db = new SpriteDatabase({
  address: 'localhost',
  username: '',
  password: '',
  databaseName: 'test'
});
