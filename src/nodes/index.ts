import { createEdgeNodes } from './create/edge/index.js';
import { insertRecordNodes } from './insert/index.js';
import { createTypeNodes } from './create/type/index.js';
import { dropTypeNodes } from './drop/type/index.js';
import { createNodes } from './create/index.js';
import { updateRecordNodes } from './update/record/index.js';
import { selectFromNodes } from './select/from/index.js';
import { deleteFromNodes } from './delete/index.js';

export interface ISpriteSqlNodes {
  create: {
    edge: object;
    type: object;
  };
  drop: {
    type: object;
  };
  insert: {
    record: object;
  };
}

export const nodes = {
  create: {
    ...createNodes,
    edge: createEdgeNodes,
    type: createTypeNodes
  },
  drop: {
    type: dropTypeNodes
  },
  insert: {
    record: insertRecordNodes
  },
  update: {
    record: updateRecordNodes
  },
  select: {
    from: selectFromNodes
  },
  delete: {
    from: deleteFromNodes
  }
} as const;
