import { where } from '../common/where.js';
import { returnCount } from './returnCount.js';
import { deleteFrom } from './delete.js';
import { limit } from './limit.js';
import { timeout } from './timeout.js';

export const deleteFromNodes = {
  delete: deleteFrom,
  where,
  returnCount,
  limit,
  timeout
};
