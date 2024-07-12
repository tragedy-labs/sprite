// export function superType<T>(typeName: T) {
//     return `EXTENDS ${typeName}`;
// }

import { superType } from '@/nodes/create/type/superType';

describe('sql > nodes > create > type > supertype', () => {
  it('should return a string EXTENDS + [typeName]', () => {
    const typeName = 'aType';
    expect(superType(typeName)).toBe(`EXTENDS ${typeName}`);
  });
});
