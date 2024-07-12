import {
  ArcadeSelectTimeoutStrategy,
  strategy
} from '@/nodes/select/from/strategy';

describe('sql > nodes > select > from > strategy', () => {
  // export function strategy(strategy: ArcadeSelectTimeoutStrategy) {
  //   return `${strategy}`;
  // }
  it('it should return the string passed to it', () => {
    const input: ArcadeSelectTimeoutStrategy = 'EXCEPTION';
    const result = strategy(input);

    expect(result).toBe(input);
  });
  it('it should handle different inputs', () => {
    const input: ArcadeSelectTimeoutStrategy = 'RETURN';
    const result = strategy(input);

    expect(result).toBe(input);
  });
});
