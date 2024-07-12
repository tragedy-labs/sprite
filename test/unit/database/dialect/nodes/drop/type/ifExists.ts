// export function ifExists() {
//   return `IF EXISTS`;
// }

import { ifExists } from '@/nodes/drop/type/ifExists';

describe('sql > nodes > drop > type > ifExist', () => {
  it('should return "IF EXISTS" SQL clause', () => {
    const expectedResult = 'IF EXISTS';
    const result = ifExists();
    expect(result).toEqual(expectedResult);
  });
});
