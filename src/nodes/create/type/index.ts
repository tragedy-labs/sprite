import { ifNotExists } from '../../common/ifNotExists.js';
import { create } from './create.js';
import { superType } from './superType.js';
import { totalBuckets } from './totalBuckets.js';
import { type } from './type.js';

export const createTypeNodes = {
  create,
  type,
  ifNotExists,
  superType,
  totalBuckets
};
