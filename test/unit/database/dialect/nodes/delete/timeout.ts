// export function timeout(time: number) {
//   return `TIMEOUT ${time}`;
// }

import { timeout } from '@/nodes/delete/timeout';

describe('sql > nodes > delete > timeout', () => {
  it('should return a TIMEOUT clause with the specified time', () => {
    const time = 100;
    const expectedResult = 'TIMEOUT 100';
    const result = timeout(time);
    expect(result).toEqual(expectedResult);
  });
});
