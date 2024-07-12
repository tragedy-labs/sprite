import { timeout } from '@/nodes/select/from/timeout';

describe('sql > nodes > select > from > timeout', () => {
  // export function timeout(ms: number) {
  //   return `TIMEOUT ${ms}`;
  // }
  it('it should return TIMEOUT + [input number]', () => {
    const input: number = 1;
    const result = timeout(input);

    expect(result).toBe(`TIMEOUT ${input}`);
  });
  it('it should handle different inputs', () => {
    const input: number = 2;
    const result = timeout(input);

    expect(result).toBe(`TIMEOUT ${input}`);
  });
});
