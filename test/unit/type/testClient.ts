import { SpriteType } from '../../../src/SpriteType.js';
import { client as SpriteDatabase } from '../database/client/testClient.js';

type DocumentTypes = {
  aDocument: {
    aProperty: string;
    bProperty: number;
  };
};

export const client = new SpriteType<DocumentTypes, 'aDocument'>(
  SpriteDatabase,
  'aDocument'
);
