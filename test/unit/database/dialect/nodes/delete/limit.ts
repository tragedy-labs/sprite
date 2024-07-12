import { limit } from '@/nodes/delete/limit';

describe('sql > nodes > delte > limit', () => {
  // export function limit(numberOfRecords: number) {
  //   return `LIMIT ${numberOfRecords}`;
  // }
  it('should return a LIMIT SQL clause with the specified number of records', () => {
    const numberOfRecords = 10;
    const expectedResult = 'LIMIT 10';
    const result = limit(numberOfRecords);
    expect(result).toEqual(expectedResult);
  });
});
