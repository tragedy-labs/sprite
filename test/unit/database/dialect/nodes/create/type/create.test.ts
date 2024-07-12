// export function create(recordType: ArcadeRecordType) {
//     return `CREATE ${recordType}`;
// }

import { create } from '@/nodes/create/type/create';
import { ArcadeRecordType } from '@/types';

describe('nodes > create > type > create', () => {
  it('should return a CREATE + [recordType] string', () => {
    const recordType: ArcadeRecordType = 'document';

    expect(create(recordType)).toBe(`CREATE ${recordType}`);
  });
});
