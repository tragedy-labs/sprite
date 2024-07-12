import { limit } from '@/nodes/select/from/limit';

describe('sql > nodes > select > from > limit', () => {
  // export function limit(records: number) {
  //   return `LIMIT ${records}`;
  // }
  it('it should return the LIMIT + string input', () => {
    const input = 1;
    const result = limit(input);

    expect(result).toBe(`LIMIT ${input}`);
  });
  it('it should handle different inputs', () => {
    const input = 2;
    const result = limit(input);

    expect(result).toBe(`LIMIT ${input}`);
  });
});
