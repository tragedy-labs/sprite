// export function drop<N = string>(typeName: N) {
//     return `DROP TYPE ${typeName}`;
// }

import { drop } from "@/nodes/drop/type/drop";

describe('sql > nodes > drop > type', () => {
  it('should return a DROP TYPE SQL statement for a given type name', () => {
    const typeName = 'custom_type';
    const expectedResult = 'DROP TYPE custom_type';
    const result = drop(typeName);
    expect(result).toEqual(expectedResult);
  });
});
