import { retry } from '@/nodes/create/edge/retry';

describe('sql > nodes > create > edge > retry', () => {
  // export function retry(attempts: number) {
  //   return `RETRY ${attempts}`;
  // }
  it('should build a RETRY statement from a number', () => {
    const result = retry(3);
    expect(result).toBe('RETRY 3');
  });
});
