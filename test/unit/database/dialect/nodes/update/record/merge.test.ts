import { merge } from '@/nodes/update/record/merge';

describe('sql > nodes > update > record > merge', () => {
  // export function merge<T>(data: T) {
  //   return `MERGE ${JSON.stringify(data)}`;
  // }
  it('it should return the MERGE + stringified JSON input', () => {
    const input = { aProperty: 'aValue' };
    const result = merge(input);

    expect(result).toBe(`MERGE ${JSON.stringify(input)}`);
  });
  it('it should handle different inputs', () => {
    const input = { bProperty: 'bValue' };
    const result = merge(input);

    expect(result).toBe(`MERGE ${JSON.stringify(input)}`);
  });
});
