import { returnAfter } from '@/nodes/update/record/returnAfter';

describe('sql > nodes > update > record > returnAfter', () => {
  // export function returnAfter() {
  //   return `RETURN AFTER @this`;
  // }
  it('it should return the string RETURN AFTER @this', () => {
    const result = returnAfter();
    expect(result).toBe(`RETURN AFTER @this`);
  });
});
