import { content } from '../../common/content.js';
import { updateRecord } from './updateRecord.js';
import { merge } from './merge.js';
import { returnAfter } from './returnAfter.js';
import { upsert } from './upsert.js';

export const updateRecordNodes = {
  updateRecord,
  content,
  merge,
  returnAfter,
  upsert
};
