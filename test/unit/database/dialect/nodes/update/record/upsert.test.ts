import { upsert } from '@/nodes/update/record/upsert.js';

describe('sql > nodes > update > record > upsert', () => {
  // export const upsert = () => {
  //   return 'UPSERT';
  // };
  it('it should return and `UPSERT` string', () => {
    const result = upsert();
    expect(result).toBe(`UPSERT`);
  });
});
