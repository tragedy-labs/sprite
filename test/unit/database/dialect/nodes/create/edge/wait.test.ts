import { wait } from '@/nodes/create/edge/wait';

describe('sql > nodes > create > edge > wait', () => {
  // export function wait(time: number) {
  //   return `WAIT ${time}`;
  // }
  it('should build a WAIT statement from a number', () => {
    const result = wait(1000);
    expect(result).toBe('WAIT 1000');
  });
});
