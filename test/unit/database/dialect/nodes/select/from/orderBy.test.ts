import { orderBy } from '@/nodes/select/from/orderBy';

describe('sql > nodes > select > from > orderBy', () => {
  // export function orderBy<K>(field: K) {
  //   return `ORDER BY ${field}`;
  // }
  it('it should return the ORDER BY + string input', () => {
    const input = 'aProperty';
    const result = orderBy(input);

    expect(result).toBe(`ORDER BY ${input}`);
  });
  it('it should handle different inputs', () => {
    const input = 'bProperty';
    const result = orderBy(input);

    expect(result).toBe(`ORDER BY ${input}`);
  });
});
