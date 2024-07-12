import { unidirectional } from '@/nodes/create/edge/unidirectional';

describe('sql > nodes > create > edge > unidirectional', () => {
  // export function unidirectional() {
  //   return 'UNIDIRECTIONAL';
  // }
  it('should return UNIDIRECTIONAL', () => {
    const result = unidirectional();
    expect(result).toBe('UNIDIRECTIONAL');
  });
});
