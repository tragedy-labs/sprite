// export function unsafe() {
//   return `UNSAFE`;
// }
import { unsafe } from '@/nodes/drop/type/unsafe';

describe('sql > nodes > drop > type > unsafe', () => {
  it('should return "UNSAFE" SQL clause', () => {
    const expectedResult = 'UNSAFE';
    const result = unsafe();
    expect(result).toEqual(expectedResult);
  });
});
