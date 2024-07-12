import { content } from '../common/content.js';
import { bucket } from './bucket.js';
import { index } from './indexNode.js';
import { insertInto } from './insertInto.js';

export const insertRecordNodes = {
  bucket,
  index,
  content,
  insertInto
};
