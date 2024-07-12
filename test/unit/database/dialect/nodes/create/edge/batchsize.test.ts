import { batchSize } from '@/nodes/create/edge/batchSize';

describe('sql > nodes > batchSize', () => {
  // export function batchSize(batchSize: number) {
  //     return `BATCH ${batchSize}`;
  // }
  it('should validate the batch size', () => {
    expect(batchSize(1)).toBe('BATCH 1');
  });
});
