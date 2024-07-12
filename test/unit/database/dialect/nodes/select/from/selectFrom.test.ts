import { selectFrom } from '@/nodes/select/from/selectFrom';

describe('sql > nodes > select > from > selectFrom', () => {
  // export function selectFrom<T>(type: T) {
  //   return `SELECT FROM ${type}`;
  // }
  it('it should return the SELECT FROM + string input', () => {
    const input = 'aProperty';
    const result = selectFrom(input);

    expect(result).toBe(`SELECT FROM ${input}`);
  });
  it('it should handle different inputs', () => {
    const input = 'bProperty';
    const result = selectFrom(input);

    expect(result).toBe(`SELECT FROM ${input}`);
  });
});
