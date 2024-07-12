import { batchSize } from './batchSize.js';
import { createEdge } from './createEdge.js';
import { from } from './from.js';
import { retry } from './retry.js';
import { to } from './to.js';
import { upsert } from './upsert.js';
import { unidirectional } from './unidirectional.js';
import { wait } from './wait.js';
import { content } from '../../common/content.js';
import { ifNotExists } from '../../common/ifNotExists.js';
import { selectIndex } from '../../select/selectIndex.js';

export const createEdgeNodes = {
  content,
  createEdge,
  ifNotExists,
  upsert,
  from,
  retry,
  to,
  wait,
  unidirectional,
  batchSize,
  utility: {
    selectIndex
  }
} as const;
