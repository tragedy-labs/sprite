import { upsert } from '@/nodes/create/edge/upsert';

describe('sql > nodes > create > upsert', () => {
  // export const upsert = () => 'UPSERT';
  it('should return UPSERT', () => {
    const result = upsert();
    expect(result).toBe('UPSERT');
  });
});
